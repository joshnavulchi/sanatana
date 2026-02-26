#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'package-lock.json');
try {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('Removed package-lock.json');
  } else {
    console.log('No package-lock.json found');
  }
  process.exit(0);
} catch (err) {
  console.error('Failed to remove package-lock.json:', err);
  process.exit(1);
}
