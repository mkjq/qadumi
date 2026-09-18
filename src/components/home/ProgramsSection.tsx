'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';

// Lottie Component Wrapper
const ProgramLottie = ({ url, scaleClass }: { url: string; scaleClass?: string }) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading lottie:", err));
  }, [url]);

  if (!animationData) return <div className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse bg-white/20 rounded-full" />;

  return (
    <div className={`w-full h-full flex items-center justify-center ${scaleClass || ''}`}>
      <Lottie 
        animationData={animationData} 
        play 
        loop 
        // @ts-ignore
        rendererSettings={{ idPrefix: `lottie-${url.replace(/[^a-zA-Z0-9]/g, '')}-` }}
        style={{ width: '100%', height: '100%' }} 
        className="w-full h-full" 
      />
    </div>
  );
};

interface ProgramItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  gradient: string;
  borderAccent: string;
  circleBg: string;
  lottieUrl: string;
  scaleClass?: string;
}

const programsData: ProgramItem[] = [
  {
    id: 'store',
    title: 'متجر البطاقات والدوسيات',
    subtitle: 'طلب وتوصيل فوري بالمملكة',
    href: '/store',
    gradient: 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]',
    borderAccent: 'border-blue-300/40',
    circleBg: 'bg-white/20',
    lottieUrl: '/icons/store.json',
  },
  {
    id: 'quizzes',
    title: 'بنك الامتحانات التفاعلية',
    subtitle: 'تحديات ونقاط وجوائز',
    href: '/quizzes',
    gradient: 'bg-gradient-to-br from-[#0D9488] to-[#115E59]',
    borderAccent: 'border-emerald-300/40',
    circleBg: 'bg-white/20',
    lottieUrl: '/icons/cup.json',
  },
  {
    id: 'international',
    title: 'البرنامج الدولي والمهني BTEC',
    subtitle: 'مناهج بريطانية ومعايير عالمية',
    href: '/courses',
    gradient: 'bg-gradient-to-br from-[#4F46E5] to-[#3730A3]',
    borderAccent: 'border-purple-300/40',
    circleBg: 'bg-white/20',
    lottieUrl: '/icons/global.json',
  },
  {
    id: 'upper',
    title: 'برنامج الصفوف العليا (٧ - ١٠)',
    subtitle: 'بناء وتأهيل أكاديمي متين',
    href: '/courses',
    gradient: 'bg-gradient-to-br from-[#0284C7] to-[#0369A1]',
    borderAccent: 'border-cyan-300/40',
    circleBg: 'bg-white/20',
    lottieUrl: '/icons/book.json',
    scaleClass: 'scale-[1.35]',
  },
  {
    id: 'primary',
    title: 'برنامج الصفوف الأساسية (١ - ٦)',
    subtitle: 'تأسيس شيق وتفاعلي',
    href: '/courses',
    gradient: 'bg-gradient-to-br from-[#1E3A8A] to-[#172554]',
    borderAccent: 'border-blue-300/40',
    circleBg: 'bg-white/20',
    lottieUrl: '/icons/kids.json',
    scaleClass: 'scale-[1.8]',
  },
  {
    id: 'tawjihi',
    title: 'برنامج التوجيهي والثانوي',
    subtitle: 'شروحات ومكثفات وزارية',
    href: '/courses',
    gradient: 'bg-gradient-to-br from-[#0099FF] to-[#0070E0]',
    borderAccent: 'border-blue-300/40',
    circleBg: 'bg-white/20',
    lottieUrl: '/icons/knowledge.json',
  },
];

export default function ProgramsSection() {
  return (
    <section
      id="programs"
      className="pt-1 pb-10 sm:pt-4 sm:pb-14 lg:py-16 bg-white relative overflow-hidden font-arabic -mt-2 sm:-mt-4"
    >
      {/* ── Section Header ── */}
      <div className="text-center mb-4 sm:mb-6 px-4 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy tracking-tight"
        >
          برامج تعليمية <span className="text-cyan-accent-600">متكاملة</span>
        </motion.h2>
      </div>

      {/* ── Cards Carousel ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="flex flex-row overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 pb-6 pt-2 px-1 no-scrollbar touch-pan-x md:overflow-x-visible"
          style={{
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          dir="rtl"
        >
          {programsData.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 snap-start snap-center w-[160px] sm:w-[175px] md:w-auto aspect-square flex"
            >
              <Link
                href={item.href}
                className={`w-full h-full rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 shadow-md hover:shadow-xl ${item.gradient} group relative overflow-hidden border ${item.borderAccent}`}
              >
                {/* Top Circular Backdrop with Lottie */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${item.circleBg} backdrop-blur-sm flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform overflow-hidden p-2`}
                >
                  <ProgramLottie url={item.lottieUrl} scaleClass={item.scaleClass} />
                </div>

                {/* Bottom White Arabic Typography */}
                <h3 className="text-white font-extrabold text-xs sm:text-sm md:text-base leading-snug line-clamp-2 mt-auto">
                  {item.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
