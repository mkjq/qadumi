const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'route.ts' || file === 'route.tsx' || (dir === path.join(process.cwd(), 'src', 'app') && file === 'layout.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.startsWith('export const runtime = \'edge\';\n')) {
        content = content.replace('export const runtime = \'edge\';\n', '');
        fs.writeFileSync(fullPath, content);
        console.log('Reverted ' + fullPath);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src', 'app'));
