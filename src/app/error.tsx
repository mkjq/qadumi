'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-arabic bg-slate-50" dir="rtl">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
          !
        </div>
        <h2 className="text-2xl font-black text-navy-900 mb-3">حدث خطأ غير متوقع</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          نعتذر عن هذا الخطأ المؤقت. يمكنك محاولة إعادة تحميل الصفحة أو العودة للرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-6 rounded-xl bg-cyan-accent text-white font-bold text-sm shadow hover:bg-cyan-600 transition-colors"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-6 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
