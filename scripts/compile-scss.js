/* Copyright (c) 2025 sanatanadharmam.in
 * Licensed under SEE LICENSE IN LICENSE.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.resolve(__dirname, '..');

/* ================= CONFIG ================= */

const SCSS_SOURCE = path.join(__dirname, '../app/styles.scss');
const CSS_OUTPUT = path.join(__dirname, '../public/globals.from-scss.css');
const OUTPUT_DIR = path.dirname(CSS_OUTPUT);

/* ============== UTILITIES ================= */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${path.relative(REPO_ROOT, dir)}`);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function compileScss(options = {}) {
  const { isDev = false } = options;
  
  console.log('\n🎨 Starting SCSS compilation...');
  console.log(`   Source: ${path.relative(REPO_ROOT, SCSS_SOURCE)}`);
  console.log(`   Output: ${path.relative(REPO_ROOT, CSS_OUTPUT)}`);
  
  // Ensure output directory exists
  ensureDir(OUTPUT_DIR);
  
  try {
    // Check if source file exists
    if (!fs.existsSync(SCSS_SOURCE)) {
      throw new Error(`Source SCSS file not found: ${SCSS_SOURCE}`);
    }
    
    // Compile SCSS
    const sassCommand = isDev 
      ? `npx sass "${SCSS_SOURCE}" "${CSS_OUTPUT}" --embed-source-map`
      : `npx sass "${SCSS_SOURCE}" "${CSS_OUTPUT}" --style=compressed --no-source-map`;
    
    console.log(`   Running: npx sass ...`);
    
    const startTime = Date.now();
    execSync(sassCommand, { stdio: 'pipe' });
    const duration = Date.now() - startTime;
    
    // Verify output file was created
    if (!fs.existsSync(CSS_OUTPUT)) {
      throw new Error(`Output CSS file was not created: ${CSS_OUTPUT}`);
    }
    
    // Get file size
    const stats = fs.statSync(CSS_OUTPUT);
    const fileSize = formatBytes(stats.size);
    
    console.log(`\n✅ SCSS compilation successful!`);
    console.log(`   ✓ globals.from-scss.css -> public/globals.from-scss.css`);
    console.log(`   ✓ Size: ${fileSize}`);
    console.log(`   ✓ Time: ${duration}ms`);
    console.log(`   ✓ Mode: ${isDev ? 'development (with source maps)' : 'production (compressed)'}`);
    
    return true;
  } catch (error) {
    console.error(`\n❌ SCSS compilation failed:`);
    console.error(`   Error: ${error.message}`);
    
    if (error.stderr) {
      console.error(`   Details: ${error.stderr.toString()}`);
    }
    
    throw error;
  }
}

function verifyDeployment() {
  console.log('\n📦 SCSS deployment verification:');
  
  try {
    if (fs.existsSync(CSS_OUTPUT)) {
      const stats = fs.statSync(CSS_OUTPUT);
      const fileSize = formatBytes(stats.size);
      console.log(`   ✓ globals.from-scss.css -> public/globals.from-scss.css (${fileSize})`);
      console.log('\n✅ SCSS file present in public folder - ready for deployment.');
      return true;
    } else {
      console.warn(`   ✗ globals.from-scss.css -> MISSING in public folder`);
      console.warn('\n⚠️  Warning: SCSS file is missing. Ensure `compile-scss.js` ran during build and `public/globals.from-scss.css` is packaged in the deploy artifact.');
      return false;
    }
  } catch (error) {
    console.error('Failed to verify SCSS deployment:', error.message);
    return false;
  }
}

/* ============== CLI ================= */

if (require.main === module) {
  const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
  const verifyOnly = process.argv.includes('--verify');
  const force = process.argv.includes('--force');
  
  if (verifyOnly) {
    verifyDeployment();
    process.exit(0);
  }
  
  // Check if file already exists and skip if not forced
  if (!force && fs.existsSync(CSS_OUTPUT)) {
    const stats = fs.statSync(CSS_OUTPUT);
    const fileSize = formatBytes(stats.size);
    console.log(`SCSS file already compiled (${fileSize}) — skipping (use --force to recompile)`);
    process.exit(0);
  }
  
  try {
    compileScss({ isDev });
    verifyDeployment();
    process.exit(0);
  } catch (error) {
    console.error('SCSS compilation failed:', error.message);
    process.exit(1);
  }
}

module.exports = { compileScss, verifyDeployment };