const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(buildDir)){
  fs.mkdirSync(buildDir);
}

const files = fs.readdirSync(buildDir);

for (const file of files) {
  fs.rmSync(path.join(buildDir, file), { recursive: true, force: true });
}
console.log('build directory successfully cleaned');

fs.copyFileSync(path.join(publicDir, 'index.html'), path.join(buildDir, 'index.html'));

console.log('public/index.html was copied to build/index.html');
