
const fs = require("fs");
let code = fs.readFileSync("src/app/(public)/student/register/page.tsx", "utf8");

code = code.replace(
  /const GRADE_OPTIONS = \[[^\]]+\];/,
  "const GRADE_OPTIONS = [\n  \"ثاني ثانوي\",\n  \"أول ثانوي\",\n  \"بيتك\",\n  \"عاشر\",\n  \"تاسع\",\n  \"ثامن\",\n  \"سابع\",\n  \"سادس\",\n  \"خامس\",\n  \"رابع\",\n  \"ثالث\",\n  \"ثاني\",\n  \"أول\"\n];"
);

code = code.replace(
  "const [grade, setGrade] = useState(GRADE_OPTIONS[0]);",
  "const [grade, setGrade] = useState(GRADE_OPTIONS[0]);\n  const [gender, setGender] = useState(\"ذكر\");"
);

code = code.replace(
  /if \(!phone\.trim\(\) \|\| phone\.trim\(\)\.length < 9\) \{[^}]+\}/,
  "if (!/^07\\d{8}$/.test(phone.trim())) {\n      setError(\"يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام\");\n      return;\n    }"
);

code = code.replace(
  /grade,\s*password,/,
  "grade,\n          gender,\n          password,"
);

const newGenderHTML = `          {/* Gender */}
          <div className="flex flex-col mb-1 w-full gap-1">
            <label className="text-[#323232] font-black text-sm">الجنس</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-white px-4 py-3 border-2 border-[#323232] rounded-[5px] text-[#323232] font-bold outline-none focus:shadow-[2px_2px_0px_#323232] transition-all"
            >
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </div>`;

code = code.replace(
  "{/* Grade */}",
  newGenderHTML + "\n          {/* Grade */}"
);

fs.writeFileSync("src/app/(public)/student/register/page.tsx", code, "utf8");
console.log("Modified registration page!");

