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
      if (!content.includes('export const runtime = \'edge\'') && !content.includes('export const runtime = "edge"')) {
        content = 'export const runtime = \'edge\';\n' + content;
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src', 'app'));
