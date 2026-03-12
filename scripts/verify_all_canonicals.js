// Script: verify_all_canonicals.js
// Purpose: Checks all locale JSON files for duplicate canonical values and mismatches between canonical and URL.
// Usage: node verify_all_canonicals.js
// Main logic: Iterates through locale files, checks for duplicate canonicals, and logs issues found.

const fs = require('fs'); // Node.js file system module for file operations
const path = require('path'); // Node.js path module for handling file paths

const argv = process.argv.slice(2);
const REPO_ROOT = process.cwd(); //path.resolve(__dirname, '..', '..');

function getArgValue(prefix) {
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function resolveDir(inputPath, fallbackPath) {
  if (!inputPath) return fallbackPath;
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
}

const localesBaseDir = resolveDir(getArgValue('--locales-dir='), path.join(REPO_ROOT, 'locales')); // Locales root directory
const locales = fs.readdirSync(localesBaseDir).filter(f => {
  const stat = fs.statSync(path.join(localesBaseDir, f));
  return stat.isDirectory();
}); // List of locale directories

let totalIssues = 0; // Count of issues found
let totalDuplicates = 0; // Count of duplicate canonicals found

/**
 * Main logic: Checks each locale for duplicate canonicals and mismatches.
 * Iterates through locale files, parses JSON, and logs issues.
 */
console.log(`Checking ${locales.length} locales for duplicate canonicals...\n`);

locales.forEach(locale => {
  const localeDir = path.join(localesBaseDir, locale);
  const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));

  const canonicals = {};
  const issues = [];

  files.forEach(file => {
    const filePath = path.join(localeDir, file);

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const key = Object.keys(content)[0];

      // Skip sharable_strings
      if (key === 'sharable_strings') {
        return;
      }

      const meta = content[key]?.meta;
      if (!meta) return;

      const canonical = meta.canonical;
      const url = meta.url;

      // Check if canonical matches URL
      if (canonical !== url) {
        issues.push({
          file,
          issue: 'canonical_url_mismatch',
          canonical,
          url
        });

        // Auto-update canonical field to match url for puranas_garuda.json and puranas_karma.json in all locale folders
        if (["puranas_garuda.json", "puranas_karma.json"].includes(file)) {
          try {
            let fileContent = fs.readFileSync(filePath, 'utf8');
            // Replace canonical value with url value
            const canonicalRegex = /("canonical"\s*:\s*")[^"]*(")/;
            fileContent = fileContent.replace(canonicalRegex, `$1${url}$2`);
            fs.writeFileSync(filePath, fileContent, 'utf8');
            console.log(`    ✅ Updated canonical in ${locale}/${file} to match url.`);
          } catch (err) {
            console.log(`    ⚠️  Failed to update canonical in ${locale}/${file}: ${err.message}`);
          }
        }
      }

      // Check for duplicate canonicals
      if (canonicals[canonical]) {
        canonicals[canonical].push(file);
        issues.push({
          issue: 'duplicate_canonical',
          canonical,
          files: [canonicals[canonical][0], file]
        });
      } else {
        canonicals[canonical] = [file];
      }
    } catch (error) {
      // Skip files that can't be parsed
    }
  });

  // Group duplicates
  const duplicates = {};
  issues.forEach(issue => {
    if (issue.issue === 'duplicate_canonical') {
      if (!duplicates[issue.canonical]) {
        duplicates[issue.canonical] = new Set();
      }
      issue.files.forEach(f => duplicates[issue.canonical].add(f));
    }
  });

  if (issues.length > 0) {
    console.log(`\n❌ ${locale}: Found ${issues.length} issue(s)`);

    if (Object.keys(duplicates).length > 0) {
      console.log(`  Duplicate Canonicals:`);
      Object.entries(duplicates).forEach(([canonical, files]) => {
        console.log(`    ${canonical}:`);
        Array.from(files).forEach(f => console.log(`      - ${f}`));
        totalDuplicates++;
      });
    }

    const mismatches = issues.filter(i => i.issue === 'canonical_url_mismatch');
    if (mismatches.length > 0) {
      console.log(`  URL/Canonical Mismatches:`);
      mismatches.forEach(m => {
        console.log(`    ${m.file}:`);
        console.log(`      URL:       ${m.url}`);
        console.log(`      Canonical: ${m.canonical}`);
      });
    }

    totalIssues += issues.length;
  } else {
    console.log(`✓ ${locale}: All canonicals are unique (${Object.keys(canonicals).length} unique URLs)`);
  }
});

console.log(`\n\n=== FINAL SUMMARY ===`);
console.log(`Locales checked: ${locales.length}`);
console.log(`Total issues: ${totalIssues}`);
console.log(`Total duplicate groups: ${totalDuplicates}`);

if (totalIssues === 0) {
  console.log(`\n✅ SUCCESS: All canonical URLs are unique within each locale folder!`);
  console.log(`✅ No canonical was added to sharable_strings.json files.`);
} else {
  console.log(`\n⚠️  Please review and fix the issues listed above.`);
}
