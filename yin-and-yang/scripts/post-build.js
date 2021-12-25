const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const staticDir = path.join(buildDir, 'static');
const indexHtmlPath = path.join(buildDir, 'index.html');

const staticFiles = fs.readdirSync(staticDir);

let indexJsFileName = '';
let indexCssFileName = '';

for (const file of staticFiles) {
  if(file.endsWith('.js')) {
    indexJsFileName = path.basename(file);
  }
  if(file.endsWith('.css')) {
    indexCssFileName = path.basename(file);
  }
}

let htmlContent = fs.readFileSync(indexHtmlPath, { encoding: 'utf8' });

htmlContent = htmlContent.replace('href="static\/index.css"', `href="static/${indexCssFileName}"`);

htmlContent = htmlContent.replace('src="static\/index.js"', `src="static/${indexJsFileName}"`);

fs.writeFileSync(indexHtmlPath, htmlContent);

console.log('index.html succesfully updated');
