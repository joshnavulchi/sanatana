#!/usr/bin/env node
/**
 * Validate JSON locale content format.
 *
 * What it checks:
 * 1) File is valid JSON.
 * 2) Root JSON is a plain object.
 * 3) Top-level values are plain objects (locale-entry shape).
 * 4) If present, common content fields have valid format:
 *    - title / description: non-empty strings
 *    - meta: object with string fields (title, description, url, canonical)
 *    - openGraph: object with string fields (title, description, url, siteName, type)
 *    - consistency checks: meta.canonical === meta.url and openGraph.url === meta.url
 *
 * Usage:
 *   node scripts/validate_json_content_format.js
 *   node scripts/validate_json_content_format.js --dir=locales/en
 *   node scripts/validate_json_content_format.js --file=locales/en/home.json
 *   node scripts/validate_json_content_format.js --strict
 */

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const REPO_ROOT = path.resolve(__dirname, '..');
const includeEnBackup = argv.includes('--include-en-backup');

function getArgValue(prefix) {
  const match = argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function resolvePath(inputPath, fallbackPath) {
  if (!inputPath) return fallbackPath;
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function collectJsonFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return targetPath.toLowerCase().endsWith('.json') ? [targetPath] : [];
  }

  const files = [];
  const entries = fs.readdirSync(targetPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function shouldSkipFile(filePath) {
  if (includeEnBackup) return false;
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
  return normalizedPath.includes('/en/backup/') || normalizedPath.includes('/en/_backup/');
}

function looksLikeContentObject(value) {
  if (!isPlainObject(value)) return false;
  if (Object.prototype.hasOwnProperty.call(value, 'meta')) return true;
  if (Object.prototype.hasOwnProperty.call(value, 'openGraph')) return true;
  if (Object.prototype.hasOwnProperty.call(value, 'title') && Object.prototype.hasOwnProperty.call(value, 'description')) return true;
  return false;
}

function validateContentObject(objectPath, value, strictMode) {
  const errors = [];

  if (!isPlainObject(value)) {
    errors.push(`'${objectPath}' must be an object`);
    return errors;
  }

  if (strictMode) {
    if (!isNonEmptyString(value.title)) {
      errors.push(`'${objectPath}.title' must be a non-empty string`);
    }
    if (!isNonEmptyString(value.description)) {
      errors.push(`'${objectPath}.description' must be a non-empty string`);
    }
  }

  if (value.title !== undefined && !isNonEmptyString(value.title)) {
    errors.push(`'${objectPath}.title' must be a non-empty string when present`);
  }

  if (value.description !== undefined && !isNonEmptyString(value.description)) {
    errors.push(`'${objectPath}.description' must be a non-empty string when present`);
  }

  const hasMeta = Object.prototype.hasOwnProperty.call(value, 'meta');
  const hasOpenGraph = Object.prototype.hasOwnProperty.call(value, 'openGraph');

  if (strictMode && !hasMeta) {
    errors.push(`'${objectPath}.meta' is required in --strict mode`);
  }

  if (strictMode && !hasOpenGraph) {
    errors.push(`'${objectPath}.openGraph' is required in --strict mode`);
  }

  if (hasMeta) {
    const meta = value.meta;
    if (!isPlainObject(meta)) {
      errors.push(`'${objectPath}.meta' must be an object`);
    } else {
      const requiredMetaKeys = ['title', 'description', 'url', 'canonical'];
      for (const key of requiredMetaKeys) {
        const value = meta[key];
        if (strictMode || value !== undefined) {
          if (!isNonEmptyString(value)) {
            errors.push(`'${objectPath}.meta.${key}' must be a non-empty string`);
          }
        }
      }

      if (isNonEmptyString(meta.url) && isNonEmptyString(meta.canonical) && meta.url !== meta.canonical) {
        errors.push(`'${objectPath}.meta.canonical' must match '${objectPath}.meta.url'`);
      }
    }
  }

  if (hasOpenGraph) {
    const openGraph = value.openGraph;
    if (!isPlainObject(openGraph)) {
      errors.push(`'${objectPath}.openGraph' must be an object`);
    } else {
      const requiredOpenGraphKeys = ['title', 'description', 'url', 'siteName', 'type'];
      for (const key of requiredOpenGraphKeys) {
        const value = openGraph[key];
        if (strictMode || value !== undefined) {
          if (!isNonEmptyString(value)) {
            errors.push(`'${objectPath}.openGraph.${key}' must be a non-empty string`);
          }
        }
      }

      if (
        isNonEmptyString(openGraph.url) &&
        isPlainObject(value.meta) &&
        isNonEmptyString(value.meta.url) &&
        openGraph.url !== value.meta.url
      ) {
        errors.push(`'${objectPath}.openGraph.url' must match '${objectPath}.meta.url'`);
      }
    }
  }

  return errors;
}

function validateFile(filePath, strictMode) {
  const issues = [];
  let parsed;

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const normalized = raw.replace(/^\uFEFF/, '');
    parsed = JSON.parse(normalized);
  } catch (error) {
    issues.push(`invalid JSON: ${error.message}`);
    return issues;
  }

  if (!isPlainObject(parsed)) {
    issues.push('root JSON value must be an object');
    return issues;
  }

  const topKeys = Object.keys(parsed);
  if (topKeys.length === 0) {
    issues.push('root object must not be empty');
    return issues;
  }

  if (looksLikeContentObject(parsed)) {
    issues.push(...validateContentObject('$', parsed, strictMode));
  }

  for (const key of topKeys) {
    const value = parsed[key];
    if (looksLikeContentObject(value)) {
      const entryIssues = validateContentObject(key, value, strictMode);
      for (const issue of entryIssues) {
        issues.push(issue);
      }
    }
  }

  return issues;
}

function main() {
  const strictMode = argv.includes('--strict');
  const fileArg = getArgValue('--file=');
  const dirArg = getArgValue('--dir=');

  const targetPath = resolvePath(fileArg || dirArg, path.join(REPO_ROOT, 'locales'));

  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${targetPath}`);
    process.exit(1);
  }

  let jsonFiles = [];
  try {
    jsonFiles = collectJsonFiles(targetPath);
  } catch (error) {
    console.error(`Unable to scan path: ${error.message}`);
    process.exit(1);
  }

  if (jsonFiles.length === 0) {
    console.warn('No JSON files found for validation.');
    process.exit(0);
  }

  const totalDiscovered = jsonFiles.length;
  jsonFiles = jsonFiles.filter((filePath) => !shouldSkipFile(filePath));

  if (jsonFiles.length === 0) {
    console.warn('No JSON files left after applying ignore rules.');
    process.exit(0);
  }

  let invalidCount = 0;
  let issueCount = 0;

  console.log(`Validating ${jsonFiles.length} JSON file(s) from: ${targetPath}`);
  if (totalDiscovered !== jsonFiles.length) {
    console.log(`Ignored files: ${totalDiscovered - jsonFiles.length} (en/backup)`);
  }
  console.log(`Strict mode: ${strictMode ? 'ON' : 'OFF'}`);

  for (const filePath of jsonFiles) {
    const issues = validateFile(filePath, strictMode);
    if (issues.length === 0) {
      continue;
    }

    invalidCount += 1;
    issueCount += issues.length;

    const relativePath = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
    console.log(`\n❌ ${relativePath}`);
    for (const issue of issues) {
      console.log(`  - ${issue}`);
    }
  }

  console.log('\n=== Validation Summary ===');
  console.log(`Files scanned: ${jsonFiles.length}`);
  console.log(`Invalid files: ${invalidCount}`);
  console.log(`Total issues: ${issueCount}`);

  if (invalidCount > 0) {
    process.exit(1);
  }

  console.log('✅ All checked JSON files passed format validation.');
}

main();
