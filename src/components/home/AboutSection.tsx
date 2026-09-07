'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronLeft, Sparkles, Target, Heart, Zap } from 'lucide-react';

interface AboutSectionProps { centerInfo: Record<string, string>; }

const features = [
  { icon: Target, text: 'أساتذة متخصصون بخبرات عالية', color: 'text-amber-400' },
  { icon: CheckCircle2, text: 'دوسيات شاملة مصممة باحترافية', color: 'text-green-400' },
  { icon: Sparkles, text: 'نسبة نجاح 99% في الثانوية', color: 'text-blue-400' },
  { icon: Heart, text: 'أسعار مناسبة وخصومات متعددة', color: 'text-pink-400' },
  { icon: Zap, text: 'متابعة فردية لكل طالب', color: 'text-purple-400' },
  { icon: CheckCircle2, text: 'امتحانات دورية ومستمرة', color: 'text-cyan-400' },
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
    <section className="py-16 lg:py-24 bg-[#0a0e1a] relative overflow-hidden" ref={ref}>
      {/* BG decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl hidden sm:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: visual */}
          <div className={`transition-all duration-700 order-2 lg:order-1 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative">
              <div className="gradient-border">
                <div className="glass-dark rounded-3xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-base sm:text-lg">منذ عام 2000م</h3>
                      <p className="text-white/40 text-xs sm:text-sm">أكثر من ربع قرن من العطاء</p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-4 sm:space-y-5">
                    {[
                      { label: 'نسبة النجاح', value: 99, color: 'bg-amber-400' },
                      { label: 'رضا الأهالي', value: 97, color: 'bg-green-400' },
                      { label: 'ختم المناهج', value: 100, color: 'bg-blue-400' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                          <span className="text-white/70">{item.label}</span>
                          <span className="text-white font-bold">{item.value}%</span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: visible ? `${item.value}%` : '0%', transitionDelay: `${i * 200 + 300}ms` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Areas */}
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-white/40 text-xs sm:text-sm mb-3">مناطق خدمتنا</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {areas.map(a => (
                        <span key={a} className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 whitespace-nowrap">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat */}
              <div className="absolute bottom-0 left-0 sm:-bottom-4 sm:-left-4 glass rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/10 scale-90 sm:scale-100 origin-bottom-left z-10 translate-y-4 translate-x-4 sm:translate-x-0 sm:translate-y-0">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">+50K</div>
                <div className="text-white/60 text-xs sm:text-sm whitespace-nowrap">خريج وخريجة</div>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div className={`transition-all duration-700 delay-200 order-1 lg:order-2 text-center lg:text-right ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="section-label mb-4 sm:mb-6 mx-auto lg:mx-0 text-xs sm:text-sm">قصتنا</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
              مركز <span className="gradient-text">القدومي</span><br />الثقافي
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl mx-auto lg:mx-0">
              {centerInfo.about || 'مركز القدومي الثقافي من أعرق المراكز في المنطقة وذو شهرة واسعة في مناطق ضاحية الأمير حسن وجبل النزهة وضاحية الأقصى وطبربور وما حولها.'}
            </p>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              بفضل الله تعالى، تخرّج من المركز ما يقارب 50 ألف طالب وطالبة، منهم الأطباء والمهندسين والمعلمين، ونسعى لأن تكون أنت القادم إليهم.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-8 text-right">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <f.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${f.color} flex-shrink-0`} />
                  <span className="text-white/80 text-xs sm:text-sm">{f.text}</span>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-gold inline-flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto">
              <span>اقرأ المزيد</span>
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
