const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.resolve(__dirname, '..');

const targets = process.env.STRIP_TARGETS ? process.env.STRIP_TARGETS.split(',') : ['out', 'public'];

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, cb);
    else cb(p);
  }
}

function stripHtmlComments(content) {
  // Preserve conditional comments like <!--[if ...]>...<![endif]-->
  const conds = [];
  content = content.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, (m) => {
    const token = `__COND_COMMENT_${conds.length}__`;
    conds.push(m);
    return token;
  });

  // Remove regular HTML comments
  content = content.replace(/<!--([\s\S]*?)-->/g, '');

  // Restore conditional comments
  conds.forEach((c, i) => {
    content = content.replace(`__COND_COMMENT_${i}__`, c);
  });
  return content;
}

function stripCssComments(content) {
  // Preserve /*! ... */ license comments
  const preserved = [];
  content = content.replace(/\/\*!([\s\S]*?)\*\//g, (m) => {
    const token = `__PRESERVE_CSS_${preserved.length}__`;
    preserved.push(m);
    return token;
  });

  // Remove all /* ... */ comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // Restore preserved comments at the top
  if (preserved.length) {
    content = preserved.join('\n') + '\n' + content;
  }
  return content;
}

function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext !== '.html' && ext !== '.css') return;
  try {
    const content = fs.readFileSync(file, 'utf8');
    let out = content;
    if (ext === '.html') out = stripHtmlComments(content);
    if (ext === '.css') out = stripCssComments(content);
    if (out !== content) {
      fs.writeFileSync(file, out, 'utf8');
      console.log(`Stripped comments: ${file}`);
    }
  } catch (err) {
    console.warn(`Could not process ${file}: ${err.message}`);
  }
}

(function main() {
  console.log('Strip comments: targets=', targets.join(','));
  for (const t of targets) {
    const dir = path.resolve(REPO_ROOT, t);
    if (!fs.existsSync(dir)) continue;
    walk(dir, processFile);
  }
})();
