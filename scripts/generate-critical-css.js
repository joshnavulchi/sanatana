/**
 * Home page critical CSS generator
 * --------------------------------
 * - CI-safe
 * - No Tailwind / PostCSS dependency
 * - Deterministic output
 * - < 1 KB guaranteed
 */

const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.resolve(__dirname, '..');

const OUT_FILE = path.join(REPO_ROOT, 'public', 'critical-home.css');

// Optional: only for visibility/logging
const SCAN_PATHS = [
  'app/page.tsx',
  'app/components/hero-section',
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function logScanInfo() {
  const existing = SCAN_PATHS.filter((p) =>
    fs.existsSync(path.join(REPO_ROOT, p))
  );
  console.log(
    'Generating critical CSS for Home — scoped to:',
    existing.length ? existing.join(', ') : '(no files found)'
  );
}

function writeCriticalCss() {
  /**
   * ⚠️ KEEP THIS UNDER 1 KB
   * Only above-the-fold layout styles.
   * No animations. No hover. No dark mode.
   */
  const css = `
html,body{margin:0;padding:0;height:100%}
body{background:#fff;color:#111;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}

.site-container{max-width:1100px;margin:0 auto;padding:16px}

.hero{
  min-height:60vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(180deg,#fff,#f7fafc);
}

.hero-title{
  margin:0;
  font-size:clamp(22px,4vw,40px);
  line-height:1.05;
}

.hero-subtitle{
  margin-top:8px;
  font-size:clamp(14px,2.5vw,18px);
  color:#555;
}

/* Prevent CLS */
.hero img{max-width:100%;height:auto;display:block}
`.trim();

  ensureDir(path.dirname(OUT_FILE));
  fs.writeFileSync(OUT_FILE, css, 'utf8');

  const size = Buffer.byteLength(css);
  console.log(`Wrote ${OUT_FILE} (${size} bytes)`);

  if (size > 1024) {
    console.warn(
      'Warning: critical CSS exceeds 1 KB — consider removing styles'
    );
  }
}

function main() {
  logScanInfo();
  writeCriticalCss();
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('Critical CSS generation failed:', err.message || err);
    process.exit(1);
  }
}

module.exports = { main };
