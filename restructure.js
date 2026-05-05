const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function moveFile(src, dest) {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(rootDir, dest);
  
  if (fs.existsSync(srcPath)) {
    createFolder(path.dirname(destPath));
    try {
      fs.renameSync(srcPath, destPath);
      console.log(`Moved: ${src} -> ${dest}`);
    } catch (err) {
      console.error(`Failed to move ${src}:`, err.message);
    }
  }
}

console.log('Restructuring project...\n');

// 1. Move Frontend Files
moveFile('routes/package.json', 'frontend/package.json');
moveFile('routes/package-lock.json', 'frontend/package-lock.json');
moveFile('routes/node_modules', 'frontend/node_modules'); // Preserves your installations!
moveFile('routes/index.html', 'frontend/index.html');
moveFile('vite.config.js', 'frontend/vite.config.js');

moveFile('routes/main.jsx', 'frontend/src/main.jsx');
moveFile('routes/App.jsx', 'frontend/src/App.jsx');
moveFile('routes/index.css', 'frontend/src/index.css');
moveFile('routes/Navbar.jsx', 'frontend/src/components/Navbar.jsx');

const pages = ['Home.jsx', 'Login.jsx', 'Register.jsx', 'Cart.jsx', 'Checkout.jsx', 'ProductDetails.jsx', 'Orders.jsx', 'Admin.jsx'];
pages.forEach(page => moveFile(`routes/${page}`, `frontend/src/pages/${page}`));

moveFile('routes/api.js', 'frontend/src/services/api.js');

// 2. Move Backend Files
moveFile('server.js', 'backend/server.js');
moveFile('seed.js', 'backend/seed.js');
moveFile('.env', 'backend/.env');
moveFile('package.json', 'backend/package.json'); 
moveFile('package-lock.json', 'backend/package-lock.json');
moveFile('node_modules', 'backend/node_modules'); // Preserves your installations!

// 3. Move Backend Subfolders
['models', 'controllers', 'middleware', 'routes'].forEach(srcFolder => {
  const srcPath = path.join(rootDir, srcFolder);
  if (fs.existsSync(srcPath)) {
    fs.readdirSync(srcPath).forEach(file => {
      if (file.endsWith('.js') && !file.endsWith('.jsx')) { // Target JS files only
         moveFile(`${srcFolder}/${file}`, `backend/${srcFolder}/${file}`);
      }
    });
  }
});

console.log('\n✅ Restructuring complete! Your dummyEcom folder is now correctly separated.');