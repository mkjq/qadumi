const fs = require('fs');
const file = 'src/app/api/quizzes/[id]/submit/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/error:\s*['"][^'"]*['"]/g, match => {
  if (match.includes('console.error')) return match;
  
  if (match.includes('400')) return "error: 'معرف الاختبار غير صالح'";
  if (match.includes('401')) return "error: 'غير مصرح: يرجى تسجيل الدخول'";
  if (match.includes('403')) return "error: 'غير مصرح: لا يمكنك تقديم اختبار لطالب آخر'";
  if (match.includes('404')) return "error: 'الاختبار أو الطالب غير موجود'";
  if (match.includes('500') || match.includes('API')) return "error: 'حدث خطأ أثناء معالجة الاختبار'";
  
  return "error: 'حدث خطأ أثناء إرسال الاختبار'";
});

// There is one dynamic error description:
// description: `????? ?????? ${quiz.title} ????? (+${actualPointsEarned} ????)`,
code = code.replace(/description:\s*`[^$]*\$\{quiz\.title\}[^$]*\$\{actualPointsEarned\}[^`]*`/g, "description: `مكافأة اختبار ${quiz.title} (+${actualPointsEarned} نقطة)`");

fs.writeFileSync(file, code, 'utf8');
console.log('Fixed submit route errors!');
