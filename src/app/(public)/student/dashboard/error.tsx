'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, LogIn } from 'lucide-react';
import OrganicBlob from '@/components/ui/OrganicBlob';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudentDashboardErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[StudentDashboardErrorBoundary] Caught error:', error);
  }, [error]);

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-slate-50 via-rose-50/20 to-white pt-32 pb-20 overflow-hidden flex items-center justify-center px-4"
      dir="rtl"
    >
      <OrganicBlob variant="cyan" size="xl" className="-top-24 -right-24 opacity-20 pointer-events-none" />
      <OrganicBlob variant="gold" size="lg" className="bottom-10 left-10 opacity-20 pointer-events-none" />

      <div className="relative max-w-lg w-full rounded-3xl border border-rose-200 bg-white/95 p-8 shadow-xl backdrop-blur-xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
          تعذر تحميل لوحة تحكم الطالب
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          حدث خطأ غير متوقع أثناء استرجاع بياناتك الأكاديمية ونقاطك. يرجى إعادة المحاولة أو التحقق من الاتصال بالإنترنت.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-mono text-left dir-ltr break-all">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-navy-700 via-navy-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-cyan-600 hover:to-navy-800 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/student/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>تسجيل الدخول</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-800"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
