const fs = require('fs');
const file = 'src/app/api/quizzes/[id]/submit/route.ts';
let code = fs.readFileSync(file, 'utf8');

// Fix FOR UPDATE lock
code = code.replace(/await tx\.\$executeRaw`SELECT 1 FROM "Student" WHERE id = \$\{student\.id\} FOR UPDATE`;/g, 
  '// Removed explicit FOR UPDATE lock because it throws errors on Prisma Edge clients/Neon poolers');

// Fix mojibake
code = code.replace(/{ error: '[^']*' },\s*{\s*status:\s*400\s*}/g, "{ error: 'معرف الاختبار غير صالح' },\n        { status: 400 }");
code = code.replace(/{ error: '[^']*' },\s*{\s*status:\s*401\s*}/g, "{ error: 'غير مصرح: يرجى تسجيل الدخول' },\n        { status: 401 }");
code = code.replace(/{ error: '[^']*' },\s*{\s*status:\s*403\s*}/g, "{ error: 'غير مصرح: لا يمكنك تقديم اختبار لطالب آخر' },\n          { status: 403 }");
code = code.replace(/{ error: '[^']*' },\s*{\s*status:\s*404\s*}/g, "{ error: 'الاختبار أو الطالب غير موجود' },\n        { status: 404 }");
code = code.replace(/{ error: '[^']*' },\s*{\s*status:\s*500\s*}/g, "{ error: 'حدث خطأ داخلي في الخادم أثناء تقديم الاختبار' },\n        { status: 500 }");

code = code.replace(/description:\s*`[^$]*\$\{quiz\.title\}[^$]*\$\{actualPointsEarned\}[^`]*`/g, "description: `مكافأة اختبار ${quiz.title} (+${actualPointsEarned} نقطة)`");

fs.writeFileSync(file, code, 'utf8');
