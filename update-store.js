
const fs = require("fs");
let code = fs.readFileSync("src/app/(public)/store/StoreClient.tsx", "utf8");

code = code.replace(
  "const submitOrder = async (e: React.FormEvent) => {\n    e.preventDefault();",
  "const submitOrder = async (e: React.FormEvent) => {\n    e.preventDefault();\n\n    if (!/^07\\d{8}$/.test(form.phone.trim())) {\n      toast.error(\"يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام\");\n      return;\n    }"
);

fs.writeFileSync("src/app/(public)/store/StoreClient.tsx", code, "utf8");
console.log("Fixed StoreClient phone validation");

