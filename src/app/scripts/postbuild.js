const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/study-platform/browser/index.html');
const notFoundPath = path.join(__dirname, '../dist/study-platform/browser/404.html');

fs.copyFile(indexPath, notFoundPath, (err) => {
  if (err) {
    console.error('❌ Failed to copy 404.html:', err);
  } else {
    console.log('✅ 404.html created successfully');
  }
});