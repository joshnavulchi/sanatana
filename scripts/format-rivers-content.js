const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'locales', 'en', 'rivers_connecting.json');

// Read the file
const content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);

// Convert the content string to an array, split by \n\n (double newline for paragraphs)
if (typeof data.rivers_connecting.content === 'string') {
  const contentString = data.rivers_connecting.content;
  
  // Split by sections but preserve structure
  const lines = contentString.split('\n');
  
  // Keep as array of lines for better editability
  data.rivers_connecting.content = lines;
  
  console.log('✅ Converted content from string to array of', lines.length, 'lines');
} else {
  console.log('ℹ️  Content is already an array');
}

// Write back with proper formatting
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ File updated successfully');
