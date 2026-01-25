const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_FILE = path.join(process.cwd(), 'public', 'critical-home.css');
const TEMP_DIR = path.join(process.cwd(), '.critical-temp');
const INPUT_CSS = path.join(TEMP_DIR, 'input.css');
const CONTENT_FILE = path.join(TEMP_DIR, 'content.html');
const OUT_CSS = path.join(TEMP_DIR, 'out.css');

// Default files/dirs to scan for home-critical classes
const defaultPaths = [
  path.join('app', 'page.tsx'),
  path.join('app', 'components', 'hero-section'),
  path.join('app', 'components', 'understanding'),
  path.join('app', 'components', 'git-support'),
  path.join('app', 'components', 'our-four-core-yugas')
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

function runTailwind() {
  // Prefer local binary if present, otherwise fall back to npx
  const localBin = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
  let cmd;
  if (fs.existsSync(localBin)) {
    cmd = `${localBin} -i ${INPUT_CSS} -o ${OUT_CSS} --content ${CONTENT_FILE} --minify`;
  } else {
    cmd = `npx tailwindcss -i ${INPUT_CSS} -o ${OUT_CSS} --content ${CONTENT_FILE} --minify`;
  }
  console.log('Running:', cmd);
  execSync(cmd, { stdio: 'inherit' });
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

function main() {
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
    runTailwind();
    copyOut();
  } catch (err) {
    console.error('Tailwind generation failed:', err.message);
    // Fallback: write a small hand-crafted critical CSS to ensure critical
    // home styles are present even if tailwind CLI is unavailable.
    const fallback = `/* Fallback critical CSS (minimal) */
html,body{height:100%;margin:0;padding:0}
body{background:#fff;color:#111;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial}
.site-container{max-width:1100px;margin:0 auto;padding:16px}
.hero{display:flex;align-items:center;justify-content:center;min-height:60vh;background:linear-gradient(180deg,#fff 0%,#f7fafc 100%)}
.hero .title{font-size:clamp(20px,4vw,40px);line-height:1.05;margin:0}
.hero .subtitle{font-size:clamp(14px,2.5vw,18px);margin-top:8px;color:#555}
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.card{background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.06);padding:16px}
/* Inline dimensions to avoid CLS */
.hero img{width:100%;height:auto;max-width:800px;display:block}
`;
    ensureDir(path.dirname(OUT_FILE));
    fs.writeFileSync(OUT_FILE, fallback, 'utf8');
    console.log(`Wrote fallback critical CSS to ${OUT_FILE} (${Buffer.byteLength(fallback)} bytes)`);
  } finally {
    cleanup();
  }
}

if (require.main === module) main();

module.exports = { main };
