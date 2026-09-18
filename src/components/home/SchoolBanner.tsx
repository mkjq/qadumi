import Link from 'next/link';
import { GraduationCap, ArrowLeft, BookOpen, FileText, CheckCircle2 } from 'lucide-react';

export default function SchoolBanner() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-slate-50/60 relative" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Navy Showcase Card matching Jo Academy School Card Pattern */}
        <div className="bg-gradient-to-br from-[#07172F] via-[#0B2144] to-[#0E2C5B] rounded-[2.2rem] p-7 sm:p-12 text-white text-center shadow-2xl border border-white/10 relative overflow-hidden group">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-accent-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Educational Illustration / Visual Hero Element */}
          <div className="relative mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 72 72" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md" fill="none">
              {/* Laptop base */}
              <rect x="10" y="50" width="52" height="4" rx="2" fill="#94A3B8" />
              <rect x="28" y="50" width="16" height="2" rx="1" fill="#E2E8F0" />
              {/* Laptop screen */}
              <rect x="16" y="20" width="40" height="28" rx="3" fill="#0B132B" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="19" y="23" width="34" height="22" rx="1" fill="#1E293B" />
              {/* Screen graphic: Open Book & Graduation Cap */}
              <path d="M24 38 C28 35, 33 35, 36 37 C39 35, 44 35, 48 38 V28 C44 26, 39 26, 36 28 C33 26, 28 26, 24 28 Z" fill="#F8FAFC" />
              <line x1="36" y1="28" x2="36" y2="37" stroke="#00A3E0" strokeWidth="1.5" />
              <polygon points="36,25 44,28 36,31 28,28" fill="#F59E0B" />
            </svg>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black mb-4 text-white tracking-tight leading-tight">
            برامج <span className="text-cyan-accent">مركز القدومي</span> التعليمية
          </h3>

          <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-normal">
            نموذج تعليمي متكامل يغطي جميع المراحل الدراسية من الصف الأول الأساسي وحتى التوجيهي، تجد فيه شروحات المنهاج، الدوسيات المعتمدة، واختبارات تفاعلية تقيس مستواك بدقة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/grades"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-cyan-accent hover:bg-cyan-500 text-white font-black text-sm sm:text-base shadow-lg shadow-cyan-accent/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <GraduationCap size={18} />
              <span>تعلّم الآن مجاناً</span>
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="/quizzes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm transition-all"
            >
              <span>بنك الامتحانات</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
