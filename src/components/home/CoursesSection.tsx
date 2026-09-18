'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, BookA, GraduationCap, Microscope, Atom, BookMarked, Trophy, HeartHandshake, ShieldCheck } from 'lucide-react';

const gradeGroups = [
  { title: 'الأول للثالث الأساسي', icon: BookA, color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-500', bgColor: 'bg-blue-50', subjects: ['اللغة العربية', 'الرياضيات', 'العلوم', 'الانجليزية'] },
  { title: 'الرابع إلى العاشر', icon: BookMarked, color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-500', bgColor: 'bg-purple-50', subjects: ['عربي', 'رياضيات', 'فيزياء', 'كيمياء', 'انجليزي', 'أحياء'] },
  { title: 'الأول ثانوي', icon: Atom, color: 'from-green-500 to-emerald-500', iconColor: 'text-green-500', bgColor: 'bg-green-50', subjects: ['عربي', 'رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'انجليزي'] },
  { title: 'التوجيهي الأكاديمي', icon: GraduationCap, color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-500', bgColor: 'bg-amber-50', subjects: ['عربي', 'رياضيات', 'فيزياء', 'كيمياء', 'انجليزي', 'BETC'] },
  { title: 'البرنامج المهني BTEC', icon: Microscope, color: 'from-red-500 to-rose-500', iconColor: 'text-red-500', bgColor: 'bg-red-50', subjects: ['تخصص', 'رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'انجليزي'] },
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
    <section className="py-20 md:py-28 lg:py-28 bg-slate-50 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="section-label mx-auto w-fit text-xs sm:text-sm mb-4">
            المسارات والمواد الدراسية
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4 tracking-tight">
            ماذا <span className="gradient-text-cyan">ندرّس؟</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
            تغطية شاملة ومكثفة لكافة المناهج الدراسية لجميع الصفوف والمراحل
          </p>
        </div>

        {/* Grade cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {gradeGroups.map((g, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms` }}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${g.bgColor} flex items-center justify-center`}>
                  <g.icon className={`w-6 h-6 ${g.iconColor}`} />
                </div>
                <h3 className="text-[#0B1D3A] font-bold text-base sm:text-lg">{g.title}</h3>
              </div>
              
              {/* Gradient bar */}
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${g.color} mb-5 opacity-80`} />
              
              {/* Subjects */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {g.subjects.map(s => (
                  <span key={s} className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing banner */}
        <div className="relative rounded-3xl overflow-hidden bg-cyan-50/70 border border-cyan-200/80 shadow-sm">
          <div className="relative p-8 sm:p-12 text-center">
            <div className="section-label mx-auto w-fit text-xs sm:text-sm mb-4">
              <Sparkles className="w-4 h-4 text-cyan-accent flex-shrink-0" />
              <span>عروض وخصومات مميزة</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-4 tracking-tight">
              أسعار في <span className="gradient-text-cyan">متناول الجميع</span>
            </h3>
            
            <p className="text-slate-500 mb-10 sm:mb-12 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              نؤمن بأن التعليم الجيد حق لكل طالب، ونوفر باقات وخصومات تشجيعية لكافة المراحل
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 max-w-4xl mx-auto">
              {perks.map(p => (
                <div key={p.title} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-4 flex justify-center text-[#FFB800]">
                    <p.icon className="w-10 h-10" />
                  </div>
                  <h4 className="text-navy-900 font-bold text-base sm:text-lg mb-2">{p.title}</h4>
                  <p className="text-slate-500 text-sm">{p.desc}</p>
                </div>
              ))}
            </div>
            
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-base bg-cyan-accent hover:bg-cyan-600 text-white px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-cyan-accent/25 hover:-translate-y-0.5 transition-all font-bold shadow-md shadow-cyan-accent/20 w-full sm:w-auto">
              <span>استفسر عن الأسعار والتسجيل</span>
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
