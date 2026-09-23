const fs = require("fs");
const files = [
  "src/app/api/student/register/route.ts",
  "src/app/(public)/student/register/page.tsx",
  "src/app/(public)/store/StoreClient.tsx",
  "src/components/home/ContactSection.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  
  // Replace regex checks. We will look for: !/^07\d{8}$/.test(VAR.trim()) and replace it with: !/^07[0-9]{8}$/.test(VAR.replace(/[^0-9]/g, ''))
  content = content.replace(/!\/\^07\\d\{8\}\$\/\.test\((.*?)\.trim\(\)\)/g, '(!/^07[0-9]{8}$/.test($1.replace(/[^0-9]/g, "")))');
  
  // Fix the mojibake. Instead of exact weird strings, we can just replace the specific strings we know were there.
  // We can just find the Error constructor and set errors, or we can look for specific mojibake patterns.
  // Actually, since I broke the Arabic in the PREVIOUS session using powershell, let's just replace all weird occurrences.
  content = content.replace(/USOOU% OO_OrO U, OU,U. UO OU\? OO U,O-/g, "يرجى إدخال رقم هاتف صالح");
  content = content.replace(/USOOU% OO_OrO U, O O3U. O U,OO U,O" UO U.U,O U</g, "يرجى إدخال اسم مستخدم صالح (حرفين على الأقل)");
  content = content.replace(/USOOU% O U,OOUO_ U.U\+ O O3OUSU\?O O OU.USO1 O'OU\^O UU,U.Oc O U,U.OU\^O/g, "يرجى التأكد من استيفاء جميع شروط كلمة المرور");
  content = content.replace(/UU,U.OUS O U,U.OU\^O OUSO U.OOO O"U,OUSU\+/g, "كلمتي المرور غير متطابقتين");
  content = content.replace(/U\?O'U, OU\+O'O O O U,O-O3O O"OO USOOU% O U,U.O-O U\^U,Oc U.OO_O_O U</g, "فشل إنشاء الحساب، يرجى المحاولة مجدداً");
  content = content.replace(/USOOU% OO_OrO U, OU,U. UO OU\? OOO_U\+US OOUSO USO"O_O O"U\? 07 U\^USOUU\^U\+ U.U\+ 10\s*OOU,O U\./g, "يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام");
  
  // Just in case, let's also fix the generic string that is failing on the server
  content = content.replace(/'USO[^']*'/g, "'يرجى إدخال رقم هاتف صالح'");
  
  fs.writeFileSync(file, content, "utf8");
}
console.log("Fixed regex and Mojibake!");
