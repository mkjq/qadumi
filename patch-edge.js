const fs = require('fs');
let code = fs.readFileSync('node_modules/@prisma/client/runtime/edge.mjs', 'utf8');
code = code.replace('if(o&&s||s){let u;throw u=["Prisma Client was configured', 'if(false){let u;throw u=["Prisma Client was configured');
fs.writeFileSync('node_modules/@prisma/client/runtime/edge.mjs', code, 'utf8');
console.log('Patched global edge.mjs');
