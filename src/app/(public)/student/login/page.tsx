'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

export default function StudentLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول، يرجى التحقق من البيانات');
        setLoading(false);
        return;
      }

      setSuccess(true);
      if (typeof window !== 'undefined' && data.student) {
        localStorage.setItem('student_info', JSON.stringify(data.student));
      }

      setTimeout(() => {
        router.push('/student/dashboard');
        router.refresh();
      }, 600);
    } catch {
      setError('حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة لاحقاً');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pt-32 pb-20 px-4 flex items-center justify-center font-arabic" dir="rtl">
      
      <div className="w-full max-w-sm">
        <form 
          onSubmit={handleSubmit} 
          className="bg-[#d3d3d3] p-7 flex flex-col items-start justify-center gap-5 rounded-[5px] border-2 border-[#323232] shadow-[4px_4px_0px_#323232]"
        >
          {/* Title */}
          <div className="flex flex-col mb-2 w-full">
            <span className="text-[#323232] font-black text-2xl mb-1">أهلاً بك مجدداً،</span>
            <span className="text-[#666666] font-bold text-[17px]">سجل دخولك للمتابعة</span>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="w-full p-3 bg-red-100 border-2 border-red-900 text-red-900 font-bold text-sm flex items-center gap-2 rounded-[5px] shadow-[2px_2px_0px_#7f1d1d]">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="w-full p-3 bg-green-100 border-2 border-green-900 text-green-900 font-bold text-sm flex items-center gap-2 rounded-[5px] shadow-[2px_2px_0px_#14532d]">
              <CheckCircle2 size={18} />
              <span>تم الدخول بنجاح! جاري التحويل...</span>
            </div>
          )}

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
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all text-right placeholder:text-slate-400 placeholder:font-medium disabled:opacity-70"
            />
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
              className="w-full h-[45px] rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] text-[15px] font-bold text-[#323232] px-3 outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#323232] transition-all text-right placeholder:text-slate-400 disabled:opacity-70"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="group relative overflow-hidden z-10 w-full h-[45px] mt-2 rounded-[5px] border-2 border-[#323232] bg-white shadow-[4px_4px_0px_#323232] flex items-center justify-center gap-2 text-[16px] font-bold text-[#323232] cursor-pointer hover:text-[#e8e8e8] transition-colors duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#323232] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 right-0 h-full w-0 bg-[#212121] -z-10 shadow-[4px_8px_19px_-3px_rgba(0,0,0,0.27)] transition-all duration-300 group-hover:w-full group-disabled:hidden" />
            
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#323232] group-hover:border-[#e8e8e8] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <LogIn size={18} className="rotate-180" />
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
                href={whatsappLink('0791586891')} 
                target="_blank" 
                className="hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4"
              >
                نسيت كلمة المرور؟ تواصل مع الإدارة
              </Link>
              
              <Link 
                href="/student/register" 
                className="hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4"
              >
                ليس لديك حساب؟ أنشئ حسابك الآن
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
