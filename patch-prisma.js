const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    if (content.includes('eval("__dirname")')) {
      content = content.replaceAll('eval("__dirname")', '"/"');
      changed = true;
    }
    if (content.includes("eval('__dirname')")) {
      content = content.replaceAll("eval('__dirname')", '"/"');
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Patched:', filePath);
    }
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full);
    } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
      patchFile(full);
    }
  }
}

console.log('Scanning @prisma and .prisma...');
walkDir(path.join(__dirname, 'node_modules', '@prisma'));
walkDir(path.join(__dirname, 'node_modules', '.prisma'));
console.log('Scan and patch complete!');
