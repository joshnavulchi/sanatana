const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_FILE = path.join(process.cwd(), 'public', 'critical-home.css');
const TEMP_DIR = path.join(process.cwd(), '.critical-temp');
const INPUT_CSS = path.join(TEMP_DIR, 'input.css');
const CONTENT_FILE = path.join(TEMP_DIR, 'content.html');
const OUT_CSS = path.join(TEMP_DIR, 'out.css');

// Default files/dirs to scan for home-critical classes.
// Narrow the scan to the most important components to reduce critical CSS size.
const defaultPaths = [
  path.join('app', 'page.tsx'),
  path.join('app', 'components', 'hero-section')
];

function collectFiles(paths) {
  const exts = ['.tsx', '.ts', '.jsx', '.js', '.html'];
  const out = [];
  for (const p of paths) {
    const full = path.join(process.cwd(), p);
    if (!fs.existsSync(full)) continue;
    const stat = fs.statSync(full);
    if (stat.isFile()) {
      out.push(full);
      continue;
    }
    (function walk(dir) {
      for (const name of fs.readdirSync(dir)) {
        const fp = path.join(dir, name);
        const s = fs.statSync(fp);
        if (s.isDirectory()) walk(fp);
        else if (exts.includes(path.extname(fp))) out.push(fp);
      }
    })(full);
  }
  return Array.from(new Set(out));
}

function ensureTemp() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
}

function writeInputCss() {
  const css = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;
  fs.writeFileSync(INPUT_CSS, css, 'utf8');
}

function writeContentFile(files) {
  let combined = '<!doctype html><html><head></head><body>'; 
  for (const f of files) {
    try { combined += '\n' + fs.readFileSync(f, 'utf8'); } catch (e) {}
  }
  combined += '</body></html>';
  fs.writeFileSync(CONTENT_FILE, combined, 'utf8');
}

async function runTailwind() {
  // Prefer local binary. If it's missing, attempt a programmatic PostCSS+Tailwind run
  // to avoid depending on `node_modules/.bin` in production installs.
  const localBin = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
  if (fs.existsSync(localBin)) {
    const cmd = `${localBin} -i ${INPUT_CSS} -o ${OUT_CSS} --content ${CONTENT_FILE} --minify`;
    console.log('Running:', cmd);
    execSync(cmd, { stdio: 'inherit' });
    return true;
  }

  console.log('tailwindcss binary not found in node_modules/.bin — attempting programmatic Tailwind via PostCSS');
  try {
    const postcss = require('postcss');
    // Use the official `tailwindcss` package programmatically. This works
    // in environments where `node_modules/.bin/tailwindcss` may be missing
    // (for example Yarn v4 PnP installs).
    const tailwindPlugin = require('tailwindcss');
    const inputCss = fs.readFileSync(INPUT_CSS, 'utf8');
    const result = await postcss([tailwindPlugin({ content: [CONTENT_FILE] })]).process(inputCss, { from: INPUT_CSS, to: OUT_CSS });
    fs.writeFileSync(OUT_CSS, result.css, 'utf8');
    return true;
  } catch (err) {
    console.log('Programmatic Tailwind failed:', err && err.message ? err.message : err);
    return false;
  }
}

function copyOut() {
  ensureDir(path.dirname(OUT_FILE));
  const css = fs.readFileSync(OUT_CSS, 'utf8');
  fs.writeFileSync(OUT_FILE, css, 'utf8');
  console.log(`Wrote ${OUT_FILE} (${Buffer.byteLength(css)} bytes)`);
  if (Buffer.byteLength(css) > 8 * 1024) console.warn('Warning: critical CSS > 8KB — consider reducing classes used on home page');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanup() {
  try { fs.rmSync(TEMP_DIR, { recursive: true, force: true }); } catch (e) {}
}

async function main() {
  const paths = process.argv.slice(2).length ? process.argv.slice(2) : defaultPaths;
  console.log('Generating critical CSS for Home — scanning:', paths.join(', '));
  const files = collectFiles(paths);
  if (files.length === 0) {
    console.warn('No files found to scan — aborting');
    return;
  }
  ensureTemp();
  writeInputCss();
  writeContentFile(files);
  try {
    const ran = await runTailwind();
    if (ran) {
      copyOut();
    } else {
      // Tailwind CLI not available — write fallback without invoking npx to avoid noisy errors
      console.log('Tailwind CLI not available; writing fallback critical CSS');
      const fallback = `/* Fallback critical CSS (minimal) */\nhtml,body{height:100%;margin:0;padding:0}\nbody{background:#fff;color:#111;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial}\n.site-container{max-width:1100px;margin:0 auto;padding:16px}\n.hero{display:flex;align-items:center;justify-content:center;min-height:60vh;background:linear-gradient(180deg,#fff 0%,#f7fafc 100%)}\n.hero .title{font-size:clamp(20px,4vw,40px);line-height:1.05;margin:0}\n.hero .subtitle{font-size:clamp(14px,2.5vw,18px);margin-top:8px;color:#555}\n.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}\n.card{background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.06);padding:16px}\n/* Inline dimensions to avoid CLS */\n.hero img{width:100%;height:auto;max-width:800px;display:block}\n`;
      ensureDir(path.dirname(OUT_FILE));
      fs.writeFileSync(OUT_FILE, fallback, 'utf8');
      console.log(`Wrote fallback critical CSS to ${OUT_FILE} (${Buffer.byteLength(fallback)} bytes)`);
    }
  } catch (err) {
    console.error('Tailwind generation failed:', err && err.message ? err.message : err);
  } finally {
    cleanup();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  });
}

module.exports = { main };
