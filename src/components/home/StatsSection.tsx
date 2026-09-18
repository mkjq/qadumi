'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, Award, BookOpen, Clock, GraduationCap, MapPin } from 'lucide-react';
import CountUp from '@/components/ui/CountUp';
import { motion, useInView } from 'framer-motion';

interface Stat {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  color: string;
  gradient: string;
  description: string;
}

interface StatsSectionProps {
  centerInfo?: Record<string, string>;
}

export default function StatsSection({ centerInfo }: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const grads = parseInt(centerInfo?.graduates || '50000') || 50000;
  const success = parseInt(centerInfo?.successRate || '99') || 99;
  const foundedYear = parseInt(centerInfo?.founded || '2000') || 2000;
  const yearsExp = Math.max(1, new Date().getFullYear() - foundedYear);

  const stats: Stat[] = [
    { 
      icon: Users, 
      value: grads, 
      suffix: '+', 
      label: 'خريج وخريجة', 
      color: 'text-blue-400', 
      gradient: 'from-blue-400 to-blue-600',
      description: 'بفضل الله تعالى' 
    },
    { 
      icon: Award, 
      value: success, 
      suffix: '%', 
      label: 'نسبة النجاح', 
      color: 'text-amber-400', 
      gradient: 'from-amber-400 to-amber-600',
      description: 'في الثانوية العامة' 
    },
    { 
      icon: GraduationCap, 
      value: yearsExp, 
      suffix: '+', 
      label: 'سنة خبرة', 
      color: 'text-emerald-400', 
      gradient: 'from-emerald-400 to-emerald-600',
      description: 'في مجال التدريس' 
    },
    { 
      icon: BookOpen, 
      value: 12, 
      suffix: '+', 
      label: 'مادة دراسية', 
      color: 'text-pink-400', 
      gradient: 'from-pink-400 to-pink-600',
      description: 'الأول حتى التوجيهي' 
    },
  ];

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] font-arabic" ref={ref}>
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs sm:text-sm font-bold mb-4">
            <Award className="w-4 h-4" />
            <span>أرقامنا تتحدث</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            إنجازات <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 bg-clip-text text-transparent">تُلهم</span> الطموح
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Circular Arc (Jo Academy Clone style, but with Lucide Icons instead of Star) */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-6 flex items-center justify-center group">
                {/* Background Track */}
                <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="4" 
                  />
                  {/* Animated Arc */}
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="5"
                    strokeLinecap="round"
                    className={`${stat.color} transition-all duration-[2000ms] ease-out`}
                    style={{
                      strokeDasharray: 289,
                      strokeDashoffset: isInView ? 40 : 289, // Leaves a small gap
                    }}
                  />
                </svg>

                {/* Inner Glow & Icon (Replacing the old star) */}
                <div className={`absolute inset-3 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: i * 0.1 + 0.5, type: 'spring' }}
                  className={`relative z-10 ${stat.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
                >
                  <stat.icon className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
                </motion.div>
              </div>

              {/* Number and Label */}
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-white mb-2 flex items-center justify-center gap-1 drop-shadow-sm">
                  {isInView ? (
                    <CountUp
                      to={stat.value}
                      from={0}
                      direction="up"
                      duration={2.5}
                      className="font-black"
                      separator=","
                    />
                  ) : (
                    <span>0</span>
                  )}
                  <span className={stat.color}>{stat.suffix}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-200 mb-1">{stat.label}</h3>
                <p className="text-sm text-slate-400 font-medium">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
