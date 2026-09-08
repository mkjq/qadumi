'use client';
import { useEffect, useRef, useState } from 'react';
import { Users, Award, BookOpen, Clock, TrendingUp, MapPin } from 'lucide-react';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

interface Stat {
  icon: any; value: number; suffix: string; label: string;
  color: string; bgColor: string; description: string;
}

interface StatsSectionProps {
  centerInfo?: Record<string, string>;
}

export default function StatsSection({ centerInfo }: StatsSectionProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const grads = parseInt(centerInfo?.graduates || '50000') || 50000;
  const success = parseInt(centerInfo?.successRate || '99') || 99;
  const foundedYear = parseInt(centerInfo?.founded || '2000') || 2000;
  const yearsExp = Math.max(1, new Date().getFullYear() - foundedYear);

  const stats: Stat[] = [
    { icon: Users, value: grads, suffix: '+', label: 'خريج وخريجة', color: 'text-blue-400', bgColor: 'bg-blue-500/20', description: 'بفضل الله تعالى (عدد تقريبي)' },
    { icon: Award, value: success, suffix: '%', label: 'نسبة النجاح', color: 'text-amber-400', bgColor: 'bg-amber-500/20', description: 'في الثانوية العامة' },
    { icon: TrendingUp, value: yearsExp, suffix: '+', label: 'سنة خبرة', color: 'text-green-400', bgColor: 'bg-green-500/20', description: 'في مجال التدريس' },
    { icon: Clock, value: 7, suffix: '', label: 'ساعات يومياً', color: 'text-purple-400', bgColor: 'bg-purple-500/20', description: centerInfo?.workingHours || '2:00م حتى 9:00م' },
    { icon: BookOpen, value: 12, suffix: '+', label: 'مادة دراسية', color: 'text-pink-400', bgColor: 'bg-pink-500/20', description: 'الأول حتى التوجيهي' },
    { icon: MapPin, value: 4, suffix: '+', label: 'منطقة خدمة', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', description: centerInfo?.areas ? centerInfo.areas.split('،')[0] + ' والمحيط' : 'الأمير حسن والمحيط' },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-bg-light py-16 lg:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-label mx-auto w-fit text-xs sm:text-sm">أرقامنا تتحدث</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4 mb-4">
            إنجازات <span className="gradient-text">تُلهم</span> الطموح
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
            أرقام حقيقية تعكس مسيرة عطاء امتدت لأكثر من ربع قرن
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, animate }: { stat: Stat; index: number; animate: boolean }) {
  const count = useCountUp(stat.value, 2000 + index * 200, animate);
  const formatted = stat.value >= 1000 ? (count / 1000).toFixed(count >= 1000 ? 0 : 1) + 'K' : String(count);

  return (
    <div className="card-premium rounded-2xl p-5 sm:p-6 group flex items-start gap-4 sm:block"
      style={{ transitionDelay: `${index * 80}ms`, opacity: animate ? 1 : 0, transform: animate ? 'none' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
      <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} sm:mb-4 group-hover:scale-110 transition-transform`}>
        <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
      </div>
      <div>
        <div className={`stat-number ${stat.color} mb-1 leading-none`}>
          {formatted}{stat.suffix}
        </div>
        <div className="text-white font-bold text-sm sm:text-base mb-1">{stat.label}</div>
        <div className="text-white/40 text-xs sm:text-sm">{stat.description}</div>
      </div>
    </div>
  );
}
