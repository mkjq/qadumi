const fs = require('fs');
const path = require('path');

console.log('--- Running bundle patcher ---');

// 1. Patch node_modules/@prisma to prevent eval in library/binary engines
function patchPrisma() {
  const dirs = [
    path.join(__dirname, 'node_modules', '@prisma'),
    path.join(__dirname, 'node_modules', '.prisma'),
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    function walk(d) {
      for (const f of fs.readdirSync(d)) {
        const full = path.join(d, f);
        if (fs.statSync(full).isDirectory()) {
          walk(full);
        } else if (f.endsWith('.js') || f.endsWith('.mjs')) {
          let code = fs.readFileSync(full, 'utf8');
          if (code.includes('eval("__dirname")') || code.includes("eval('__dirname')")) {
            code = code.replaceAll('eval("__dirname")', '"/"').replaceAll("eval('__dirname')", '"/"');
            fs.writeFileSync(full, code, 'utf8');
            console.log('Patched __dirname in:', full);
          }
        }
      }
    }
    walk(dir);
  }
}

// 2. Patch OpenNext output files (.open-next) to remove any remaining eval
function patchOpenNext() {
  const openNextDir = path.join(__dirname, '.open-next');
  if (!fs.existsSync(openNextDir)) return;

  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (f.endsWith('.js') || f.endsWith('.mjs')) {
        let code = fs.readFileSync(full, 'utf8');
        let modified = false;

        // Patch eval("__dirname")
        if (code.includes('eval("__dirname")')) {
          code = code.replaceAll('eval("__dirname")', '"/"');
          modified = true;
          console.log('Patched eval("__dirname") in:', full);
        }

        // Patch eval("require")
        if (code.includes('eval("require")')) {
          code = code.replaceAll('eval("require")', 'require');
          modified = true;
          console.log('Patched eval("require") in:', full);
        }

        // Patch eval("require.resolve(basePath)")
        if (code.includes('eval("require.resolve(basePath)")')) {
          code = code.replaceAll('eval("require.resolve(basePath)")', 'require.resolve(basePath)');
          modified = true;
          console.log('Patched eval(require.resolve) in:', full);
        }

        // Patch eval("require.resolve(resolvedPath)")
        if (code.includes('eval("require.resolve(resolvedPath)")')) {
          code = code.replaceAll('eval("require.resolve(resolvedPath)")', 'require.resolve(resolvedPath)');
          modified = true;
          console.log('Patched eval(require.resolve) in:', full);
        }

        // Patch Lottie bodymovin expression eval
        if (code.includes('eval("[function _expression_function()')) {
          code = code.replace(
            /eval\("\[function _expression_function\(\)\{"\+val\+";scoped_bm_rt=\$bm_rt\}\]"\)\[0\]/g,
            'function(){}'
          );
          modified = true;
          console.log('Patched Lottie expression eval in:', full);
        }

        // Catch any remaining direct eval
        const matches = [...code.matchAll(/eval\("([^"]+)"\)/g)];
        for (const match of matches) {
          console.log('Found direct string eval:', match[0]);
        }
        
        // Patch Prisma Client require to use /edge in Cloudflare worker
        if (code.includes('require("@prisma/client")')) {
          code = code.replaceAll('require("@prisma/client")', 'require("@prisma/client/edge")');
          modified = true;
          console.log('Patched Prisma Client require to edge in:', full);
        }
        if (code.includes('from "@prisma/client"')) {
          code = code.replaceAll('from "@prisma/client"', 'from "@prisma/client/edge"');
          modified = true;
          console.log('Patched Prisma Client import to edge in:', full);
        }

        if (modified) {
          fs.writeFileSync(full, code, 'utf8');
        }
      }
    }
  }

  walk(openNextDir);
}

patchPrisma();
patchOpenNext();
console.log('--- Bundle patch complete! ---');
