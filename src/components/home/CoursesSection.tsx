'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronLeft, Sparkles, BookA, GraduationCap, Microscope, Atom, BookMarked, Trophy, HeartHandshake, ShieldCheck } from 'lucide-react';

const gradeGroups = [
  { title: 'الأول للثالث الأساسي', icon: BookA, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', subjects: ['اللغة العربية', 'الرياضيات', 'العلوم', 'الانجليزية'] },
  { title: 'الرابع إلى العاشر', icon: BookMarked, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', subjects: ['عربي', 'رياضيات', 'فيزياء', 'كيمياء', 'انجليزي', 'أحياء'] },
  { title: 'الأول ثانوي', icon: Atom, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', border: 'border-green-500/20', subjects: ['عربي', 'رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'انجليزي'] },
  { title: 'التوجيهي الأكاديمي', icon: GraduationCap, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', subjects: ['عربي', 'رياضيات', 'فيزياء', 'كيمياء', 'انجليزي', 'BETC'] },
  { title: 'البرنامج المهني BTEC', icon: Microscope, color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', border: 'border-red-500/20', subjects: ['تخصص', 'رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'انجليزي'] },
];

const perks = [
  { icon: Trophy, title: 'أساتذة نخبة', desc: 'في محافظة العاصمة' },
  { icon: ShieldCheck, title: 'ضمان التفوق', desc: 'متابعة حثيثة لعلامات الطالب' },
  { icon: HeartHandshake, title: 'دعم نفسي وتوجيه', desc: 'نقف بجانب الطالب خطوة بخطوة' },
];

export default function CoursesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-[#0a0e1a] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-label mx-auto w-fit text-xs sm:text-sm">المواد الدراسية</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4 mb-4">
            ماذا <span className="gradient-text">ندرّس؟</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
            تغطية شاملة لجميع المواد في كل المراحل الدراسية
          </p>
        </div>

        {/* Grade cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {gradeGroups.map((g, i) => (
            <div key={i} className={`card-premium rounded-2xl p-5 sm:p-6 border ${g.border}`}
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms` }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${g.bg} flex items-center justify-center text-xl sm:text-2xl`}>
                  <g.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${g.color.split(' ')[0].replace('from-', 'text-')}`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-[15px] leading-tight">{g.title}</h3>
                </div>
              </div>
              {/* Gradient bar */}
              <div className={`h-0.5 rounded-full bg-gradient-to-r ${g.color} mb-4 opacity-50`} />
              {/* Subjects */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {g.subjects.map(s => (
                  <span key={s} className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/8 hover:bg-white/10 transition-colors whitespace-nowrap">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing banner */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20" />
          <div className="absolute inset-0 border border-amber-500/20 rounded-3xl" />
          <div className="relative p-6 sm:p-10 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
              <span className="text-amber-400 font-semibold text-xs sm:text-sm">عروض وخصومات</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3">
              أسعار في <span className="gradient-text">متناول الجميع</span>
            </h3>
            <p className="text-white/50 mb-6 sm:mb-8 text-sm sm:text-base">نؤمن بأن التعليم الجيد حق للجميع</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8 max-w-3xl mx-auto">
              {perks.map(p => (
                <div key={p.title} className="glass rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-center">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 flex justify-center text-amber-400">
                    <p.icon className="w-8 h-8" />
                  </div>
                  <div className="text-white font-bold text-xs sm:text-sm">{p.title}</div>
                  <div className="text-white/40 text-[10px] sm:text-xs mt-1">{p.desc}</div>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-gold inline-flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto">
              <span>استفسر عن الأسعار</span>
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
