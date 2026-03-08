const fs = require('fs');
const path = require('path');

// Set the filename to delete (change as needed)
const targetFilename = ''; // Replace with the actual filename

// Path to the locales directory (relative to this script)
const localesDir = path.join(__dirname, '..', 'locales');

// Read all locale subdirectories
fs.readdirSync(localesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .forEach(dirent => {
    const localePath = path.join(localesDir, dirent.name, targetFilename);
    if (fs.existsSync(localePath)) {
      fs.unlinkSync(localePath);
      console.log(`Deleted: ${localePath}`);
    } else {
      console.log(`Not found: ${localePath}`);
    }
  });
