const fs = require('fs');
const path = require('path');

const browserPath = path.join(__dirname, '../dist/study-platform/browser');
const indexPath = path.join(browserPath, 'index.html');
const notFoundPath = path.join(browserPath, '404.html');
const nojekyllPath = path.join(browserPath, '.nojekyll');

// Copy index.html to 404.html for GitHub Pages routing
fs.copyFile(indexPath, notFoundPath, (err) => {
  if (err) {
    console.error('❌ Failed to copy 404.html:', err);
  } else {
    console.log('✅ 404.html created successfully');
  }
});

// Create .nojekyll file to disable Jekyll processing on GitHub Pages
fs.writeFile(nojekyllPath, '', (err) => {
  if (err) {
    console.error('❌ Failed to create .nojekyll:', err);
  } else {
    console.log('✅ .nojekyll created successfully');
  }
});