// extractStringsToObject.js
const fs = require('fs');
const recast = require('recast');
const babelParser = require('@babel/parser');
const path = require('path');

let FILENAME = process.argv[2];
if (!FILENAME) {
  try {
    FILENAME = require('readline-sync').question(
      'Enter the path to the .tsx file (start with app/ for pages or components, e.g. app/philosophy/karma/karmaclient.tsx or app/components/footer/Footer.tsx): '
    );
  } catch (e) {
    console.error('Please install readline-sync: npm install readline-sync');
    process.exit(1);
  }
}

// If path starts with 'app', resolve to absolute path
if (FILENAME.startsWith('app')) {
  FILENAME = path.join(__dirname, '..', FILENAME);
}

if (!fs.existsSync(FILENAME)) {
  console.error('File not found:', FILENAME);
  process.exit(1);
}

const code = fs.readFileSync(FILENAME, 'utf8');
const ast = recast.parse(code, {
  parser: {
    parse(source) {
      return babelParser.parse(source, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });
    },
  },
});

const b = recast.types.builders;
const stringMap = {};
let stringIndex = 1;

function makeKey(str) {
  let key = str
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  if (!key) key = 'label';
  if (stringMap[key]) key += '_' + stringIndex++;
  return key;
}

// Find metaKey value in the file
let metaKeyValue = null;
recast.visit(ast, {
  visitJSXAttribute(path) {
    if (
      path.value &&
      path.value.type === 'StringLiteral' &&
      path.node.name.name === 'metaKey'
    ) {
      metaKeyValue = path.value.value;
    }
    this.traverse(path);
  },
});

let objectName = 'page';
if (metaKeyValue) {
  objectName = metaKeyValue + '_page';
  objectName = objectName.replace(/[^a-zA-Z0-9_]/g, '_');
}

recast.visit(ast, {
  visitJSXText(path) {
    const value = path.value.value.trim();
    if (value && !/^{.*}$/.test(value)) {
      const key = makeKey(value);
      stringMap[key] = value;
      path.replace(b.jsxExpressionContainer(b.memberExpression(
        b.identifier(objectName),
        b.identifier(key)
      )));
    }
    this.traverse(path);
  },
  visitJSXAttribute(path) {
    if (
      path.value &&
      path.value.type === 'StringLiteral' &&
      path.value.value.trim() &&
      !/^{.*}$/.test(path.value.value)
    ) {
      const value = path.value.value;
      const key = makeKey(value);
      stringMap[key] = value;
      path.value = b.jsxExpressionContainer(
        b.memberExpression(b.identifier(objectName), b.identifier(key))
      );
    }
    this.traverse(path);
  },
});

const pageObj = b.variableDeclaration('const', [
  b.variableDeclarator(
    b.identifier(objectName),
    b.objectExpression(
      Object.entries(stringMap).map(([k, v]) =>
        b.objectProperty(b.identifier(k), b.stringLiteral(v))
      )
    )
  ),
]);

const body = ast.program.body;
let lastImport = 0;
for (let i = 0; i < body.length; i++) {
  if (body[i].type === 'ImportDeclaration') lastImport = i;
}
body.splice(lastImport + 1, 0, pageObj);

const output = recast.print(ast).code;
fs.writeFileSync(
  path.join(
    path.dirname(FILENAME),
    path.basename(FILENAME).replace('.tsx', '.extracted.tsx')
  ),
  output
);

console.log('Done! See', path.basename(FILENAME).replace('.tsx', '.extracted.tsx'));
