#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ROOT = path.resolve(__dirname, '..');

const FILE_GLOBS = [
  'app/**/*.tsx',
  'app/**/*.jsx',
  'components/**/*.tsx',
  'components/**/*.jsx',
  'pages/**/*.tsx',
  'pages/**/*.jsx',
  '**/*.mdx'
];

// Patterns of utility classes to strip when normalizing
const TYPOGRAPHY_REGEX = /(^|\s)(text-[^\s]+|text-\[[^\]]+\]|leading-[^\s]+|font-(?:bold|semibold|normal)|tracking-[^\s]+|mb-\d+|mt-\d+|list-[^\s]+|pl-\d+|text-gray-\d{3})(?=$|\s)/g;

function uniq(arr) {
  return Array.from(new Set(arr));
}

function normalizeClassListFor(tag, classes) {
  const tokens = classes.trim().split(/\s+/).filter(Boolean);
  // helper: detect typographic tokens (but preserve color tokens like text-[#fff])
  function isTypographicToken(t) {
    const tNoPrefix = t.replace(/^(?:sm:|md:|lg:|xl:|2xl:)/, '');
    if (tNoPrefix.startsWith('text-[')) {
      // keep color tokens like text-#[...]
      return !/^text-\[#/.test(tNoPrefix);
    }
    if (/^text-(?:xs|sm|md|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/.test(tNoPrefix)) return true;
    if (/^text-\d/.test(tNoPrefix)) return true;
    return /^(?:leading-|font-|tracking-|mb-|mt-|list-|pl-|text-gray-)/.test(tNoPrefix);
  }

  // remove existing typographic tokens (including responsive prefixes)
  const filtered = tokens.filter(t => !isTypographicToken(t));

  const baseAdd = [];
  const responsiveAdd = [];
  switch (tag) {
    case 'h1':
      baseAdd.push('text-3xl', 'font-semibold', 'leading-tight', 'tracking-tight', 'mb-4');
      // Only H1 gets a responsive scale at md:
      responsiveAdd.push('md:text-4xl');
      break;
    case 'h2':
      baseAdd.push('text-2xl', 'font-semibold', 'leading-snug', 'mb-3');
      break;
    case 'h3':
      baseAdd.push('text-xl', 'font-semibold', 'leading-snug', 'mb-2');
      break;
    case 'h4':
    case 'h5':
    case 'h6':
      // map smaller headings to H3 scale
      baseAdd.push('text-xl', 'font-semibold', 'leading-snug', 'mb-2');
      break;
    case 'p':
      baseAdd.push('text-base', 'leading-relaxed', 'mb-4', 'font-normal');
      break;
    case 'ul':
      baseAdd.push('list-disc', 'pl-5', 'text-base', 'leading-relaxed');
      break;
    case 'li':
      baseAdd.push('mb-2');
      break;
    case 'small':
      baseAdd.push('text-xs', 'leading-normal');
      break;
    case 'span':
    case 'div':
    default:
      baseAdd.push('text-base', 'leading-relaxed', 'font-normal');
  }

  // Ensure mobile-first ordering: base classes first, then responsive additions
  const combined = uniq(filtered.concat(baseAdd)).concat(responsiveAdd).join(' ');
  return combined;
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Handle className usages for known tags, including template literals with ${...}
  content = content.replace(/<(h[1-3]|p|ul|li|small|span|div)([^>]*)className=(?:\{)?["'`]?([^"'`\}]+)["'`]?\}?([^>]*)>/g,
    (m, tag, beforeAttrs, classStr, afterAttrs) => {
      try {
        // If the class string contains a template expression, preserve ${...} segments
        if (classStr.includes('${')) {
          // split keeping ${...} parts
          const parts = classStr.split(/(\$\{[^}]+\})/g).filter(Boolean);
          const newParts = parts.map(part => {
            if (part.startsWith('${') && part.endsWith('}')) {
              // inside expression: normalize any quoted string literals inside
              return part.replace(/(['"])([^'"\\]*?)\1/g, (_, quote, inner) => {
                const cleaned = inner.split(/\s+/).filter(Boolean).filter(tok => !/^(?:sm:|md:|lg:|xl:|2xl:)?(?:text-|text\[|leading-|font-|tracking-|mb-|mt-|list-|pl-|text-gray-)/.test(tok));
                return quote + cleaned.join(' ') + quote;
              });
            }
            // static part: normalize (remove typography tokens) but do not inject tag-specific additions into template fragments
            const cleaned = part.split(/\s+/).filter(Boolean).filter(tok => !/^(?:sm:|md:|lg:|xl:|2xl:)?(?:text-|text\[|leading-|font-|tracking-|mb-|mt-|list-|pl-|text-gray-)/.test(tok));
            return cleaned.join(' ');
          });
          const rebuilt = newParts.join(' ').replace(/\s+/g, ' ').trim();
          // Reconstruct as a template literal inside braces to preserve expressions
          return '<' + tag + beforeAttrs + 'className={' + '`' + rebuilt + '`' + '}' + afterAttrs + '>';
        }

        const normalized = normalizeClassListFor(tag, classStr);
        // clean double spaces
        return `<${tag}${beforeAttrs}className="${normalized}"${afterAttrs}>`;
      } catch (e) {
        return m;
      }
    }
  );

  // If there were inline style tokens like text-[15px], replace to text-base globally
  content = content.replace(/text-\[\d+px\]/g, 'text-base');

  // Replace random font-bold on non-heading elements to font-normal
  content = content.replace(/className=(?:\{)?["'`]([^"'`\}]*?)\bfont-bold\b([^"'`\}]*)["'`]\}?/g,
    (m, a, b) => {
      // If inside an h1/h2/h3 we prefer font-semibold; otherwise font-normal
      // This simple heuristic will convert font-bold to font-normal unless heading present
      return `className="${(a + ' ' + b).replace(/\bfont-bold\b/, 'font-normal').trim()}"`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function run() {
  const files = FILE_GLOBS.flatMap(g => glob.sync(g, { cwd: ROOT, absolute: true }));
  console.log(`Found ${files.length} candidate files.`);
  const modified = [];
  for (const f of files) {
    try {
      const changed = replaceInFile(f);
      if (changed) modified.push(path.relative(ROOT, f));
    } catch (err) {
      console.error('Error processing', f, err.message);
    }
  }
  console.log('Modified files:', modified.length);
  modified.forEach(m => console.log(' -', m));
}

if (require.main === module) run();
