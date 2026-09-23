'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronLeft, Star, Target, Heart, Zap } from 'lucide-react';

interface AboutSectionProps { centerInfo: Record<string, string>; }

const features = [
  { icon: Target, text: 'أساتذة متخصصون بخبرات عالية', color: 'text-cyan-500' },
  { icon: CheckCircle, text: 'دوسيات شاملة مصممة باحترافية', color: 'text-green-500' },
  { icon: Star, text: 'نسبة نجاح 99% في الثانوية', color: 'text-yellow-500' },
  { icon: Heart, text: 'أسعار مناسبة وخصومات متعددة', color: 'text-pink-500' },
  { icon: Zap, text: 'متابعة فردية لكل طالب', color: 'text-purple-500' },
  { icon: CheckCircle, text: 'امتحانات دورية ومستمرة', color: 'text-blue-500' },
];

const areas = ['ضاحية الأمير حسن', 'جبل النزهة', 'ضاحية الأقصى', 'طبربور'];

export default function AboutSection({ centerInfo }: AboutSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-slate-50 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header (Clean, Tight, No AI pill) */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-2 tracking-tight">
            مسيرة ريادية في <span className="gradient-text-cyan">التعليم والتميز</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
            أكثر من ربع قرن من بناء الأجيال وصناعة أوائل المملكة في قلب العاصمة عمّان
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Right: text (Text first on mobile means order-1) */}
          <div className={`transition-all duration-700 order-1 text-right ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="inline-block px-3.5 py-1 rounded-full bg-cyan-accent/10 text-cyan-accent font-bold text-xs sm:text-sm mb-4">
              قصتنا ورؤيتنا
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-6 leading-tight">
              مركز <span className="text-cyan-accent">القدومي</span> الثقافي
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              {centerInfo.about || 'مركز القدومي الثقافي من أعرق المراكز في المنطقة وذو شهرة واسعة في مناطق ضاحية الأمير حسن وجبل النزهة وضاحية الأقصى وطبربور وما حولها.'}
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              بفضل الله تعالى، تخرّج من المركز ما يقارب 50 ألف طالب وطالبة، منهم الأطباء والمهندسين والمعلمين، ونسعى لأن تكون أنت القادم إليهم.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-accent/20 transition-all">
                  <f.icon className={`w-5 h-5 ${f.color} flex-shrink-0`} />
                  <span className="text-slate-700 font-semibold text-sm">{f.text}</span>
                </div>
              ))}
            </div>

            <Link href="/about" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-cyan-accent hover:bg-cyan-600 text-white font-bold rounded-full shadow-lg shadow-cyan-accent/20 hover:shadow-cyan-accent/30 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              <span>اقرأ المزيد عن المركز</span>
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Left: visual (order-2) */}
          <div className={`transition-all duration-700 delay-200 order-2 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-navy-900 font-black text-lg">منذ عام {centerInfo?.founded || '2000'}م</h3>
                  <p className="text-slate-500 text-sm">أكثر من ربع قرن من العطاء</p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-6">
                {[
                  { label: 'نسبة النجاح', value: parseInt(centerInfo?.successRate || '99') || 99, color: 'bg-amber-400' },
                  { label: 'رضا الأهالي', value: 97, color: 'bg-green-500' },
                  { label: 'ختم المناهج', value: 100, color: 'bg-blue-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2 font-semibold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-navy-900">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: visible ? `${item.value}%` : '0%', transitionDelay: `${i * 200 + 300}ms` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Areas */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-slate-500 text-sm mb-3 font-semibold">مناطق خدمتنا</p>
                <div className="flex flex-wrap gap-2">
                  {areas.map(a => (
                    <span key={a} className="text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
