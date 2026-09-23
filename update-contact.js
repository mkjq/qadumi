
const fs = require("fs");
let code = fs.readFileSync("src/components/home/ContactSection.tsx", "utf8");

code = code.replace(
  "const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!form.name || !form.message || !form.grade || !form.phone) return;",
  "const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!form.name || !form.message || !form.grade || !form.phone) return;\n    if (!/^07\\d{8}$/.test(form.phone.trim())) {\n      toast.error(\"يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام\");\n      return;\n    }"
);

fs.writeFileSync("src/components/home/ContactSection.tsx", code, "utf8");
console.log("Fixed ContactSection phone validation");

