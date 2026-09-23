'use client';

import React, { useState, useEffect, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, AlertCircle, CheckCircle2, UserPlus, X, Check } from 'lucide-react';

const GRADE_OPTIONS = [
  "ثاني ثانوي",
  "أول ثانوي",
  "بيتك",
  "عاشر",
  "تاسع",
  "ثامن",
  "سابع",
  "سادس",
  "خامس",
  "رابع",
  "ثالث",
  "ثاني",
  "أول"
];

function StudentRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState(GRADE_OPTIONS[0]);
  const [gender, setGender] = useState("ذكر");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUpper(/[A-Z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecial(/[@$!%*?&#^()_\-+=<>{}\[\]~`|:;,.]/.test(password));
    setPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('يرجى إدخال اسم الطالب كاملاً');
      return;
    }

    if (!/^07\d{8}$/.test(phone.trim())) {
      setError("يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07 ويتكون من 10 أرقام");
      return;
    }

    if (!hasMinLength || !hasUpper || !hasNumber || !hasSpecial) {
      setError('يرجى التأكد من استيفاء جميع شروط كلمة المرور');
      return;
    }
    
    if (!passwordsMatch) {
      setError('كلمتي المرور غير متطابقتين');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          grade,
          gender,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل إنشاء الحساب، يرجى المحاولة مجدداً');
      }

      setSuccess(true);
      if (typeof window !== 'undefined' && data.student) {
        localStorage.setItem('student_info', JSON.stringify(data.student));
      }

      setTimeout(() => {
        router.push(returnUrl || '/student/dashboard');
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً');
      setLoading(false);
    }
  };

  const ConditionItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${met ? 'text-green-700' : 'text-slate-500'}`}>
      {met ? <Check size={14} className="text-green-600" /> : <X size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] pt-32 pb-20 px-4 flex items-center justify-center font-arabic" dir="rtl">
      
      <div className="w-full max-w-sm">
        <form 
          onSubmit={handleSubmit} 
          className="bg-[#d3d3d3] p-7 flex flex-col items-start justify-center gap-5 rounded-[5px] border-2 border-[#323232] shadow-[4px_4px_0px_#323232]"
        >
          {/* Title */}
          <div className="flex flex-col mb-2 w-full">
            <span className="text-[#323232] font-black text-2xl mb-1">حساب جديد</span>
            <span className="text-[#666666] font-bold text-[17px]">سجل وانضم لمنصتنا التعليمية</span>
          </div>

          {/* Welcome Bonus Notice Pill */}
          <div className="w-full p-2.5 bg-[#fef3c7] border-2 border-[#d97706] text-[#92400e] font-bold text-xs flex items-center gap-2 rounded-[5px] shadow-[2px_2px_0px_#d97706]">
            <Gift size={16} className="shrink-0" />
            <span>هدية الانضمام: 20 نقطة مجانية بحسابك!</span>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="w-full p-3 bg-red-100 border-2 border-red-900 text-red-900 font-bold text-sm flex items-center gap-2 rounded-[5px] shadow-[2px_2px_0px_#7f1d1d]">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="w-full p-3 bg-green-100 border-2 border-green-900 text-green-900 font-bold text-sm flex items-center gap-2 rounded-[5px] shadow-[2px_2px_0px_#14532d]">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>تم إنشاء الحساب بنجاح! جاري التوجيه...</span>
            </div>
          )}

          {/* Student Name */}
          <div className="w-full">
            <label className="block text-sm font-black text-[#323232] mb-1.5">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: يوسف أحمد القدومي"
              disabled={loading || success}
              required
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all text-right placeholder:text-slate-400 placeholder:font-medium disabled:opacity-70"
            />
          </div>

          {/* Phone Input */}
          <div className="w-full">
            <label className="block text-sm font-black text-[#323232] mb-1.5">رقم الهاتف</label>
            <input
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="079XXXXXXX"
              disabled={loading || success}
              required
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all text-right placeholder:text-slate-400 placeholder:font-medium disabled:opacity-70"
            />
          </div>

          {/* Grade Selector */}
          <div className="w-full">
            <label className="block text-sm font-black text-[#323232] mb-1.5">الصف / المرحلة</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              disabled={loading || success}
              required
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23323232%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left 12px center',
                backgroundSize: '12px auto'
              }}
            >
              {GRADE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Password Input */}
          <div className="w-full">
            <label className="block text-sm font-black text-[#323232] mb-1.5">كلمة المرور</label>
            <input
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading || success}
              required
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all text-right placeholder:text-slate-400 placeholder:font-medium disabled:opacity-70"
            />
            
            {/* Password Conditions */}
            <div className="mt-2.5 flex flex-col gap-1.5 bg-[#e5e7eb] p-2.5 rounded-[5px] border border-[#a1a1aa]">
              <ConditionItem met={hasMinLength} text="8 أحرف أو أكثر" />
              <ConditionItem met={hasUpper} text="يحتوي على حرف كبير واحد على الأقل (A-Z)" />
              <ConditionItem met={hasNumber} text="يحتوي على رقم واحد على الأقل (0-9)" />
              <ConditionItem met={hasSpecial} text="يحتوي على رمز خاص (@$!%*?&#...)" />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="w-full">
            <label className="block text-sm font-black text-[#323232] mb-1.5">تأكيد كلمة المرور</label>
            <input
              type="password"
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading || success}
              required
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all text-right placeholder:text-slate-400 placeholder:font-medium disabled:opacity-70"
            />
            {confirmPassword.length > 0 && (
              <div className="mt-2.5 bg-[#e5e7eb] p-2 rounded-[5px] border border-[#a1a1aa]">
                <ConditionItem met={passwordsMatch} text="كلمتا المرور متطابقتان" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success || !hasMinLength || !hasUpper || !hasNumber || !hasSpecial || !passwordsMatch}
            className="group relative overflow-hidden z-10 w-full h-[45px] mt-2 rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] flex items-center justify-center gap-2 text-[16px] font-bold text-[#323232] cursor-pointer hover:text-[#e8e8e8] transition-colors duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#323232] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 right-0 h-full w-0 bg-[#212121] -z-10 shadow-[4px_8px_19px_-3px_rgba(0,0,0,0.27)] transition-all duration-300 group-hover:w-full group-disabled:hidden" />
            
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#323232] group-hover:border-[#e8e8e8] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>إنشاء الحساب</span>
                <UserPlus size={18} />
              </>
            )}
          </button>

          {/* Separator & Links */}
          <div className="w-full mt-2">
            <div className="w-full flex items-center justify-center gap-2 mb-4">
              <div className="h-[3px] flex-1 rounded-[5px] bg-[#666666]" />
              <span className="text-[#323232] font-black text-sm px-2">أو</span>
              <div className="h-[3px] flex-1 rounded-[5px] bg-[#666666]" />
            </div>

            <div className="flex flex-col items-center gap-3 text-[14px] font-bold text-[#323232]">
              <Link 
                href="/student/login" 
                className="hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4"
              >
                لديك حساب بالفعل؟ تسجيل الدخول
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" /></div>}>
      <StudentRegisterContent />
    </Suspense>
  );
}
