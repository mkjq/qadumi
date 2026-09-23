const fs = require('fs');
const p = '.open-next/server-functions/default/handler.mjs';
const c = fs.readFileSync(p, 'utf8');
const idx = c.indexOf('_expression_function');
console.log('Index:', idx);
if (idx !== -1) {
  console.log(c.substring(Math.max(0, idx - 200), Math.min(c.length, idx + 300)));
}
