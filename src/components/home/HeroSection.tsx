'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  Flame,
  MessageCircle,
  GraduationCap,
} from 'lucide-react';
import { whatsappLink } from '@/lib/utils';
import OrganicBlob from '@/components/ui/OrganicBlob';

interface HeroSectionProps {
  centerInfo?: Record<string, string>;
}



export default function HeroSection({ centerInfo }: HeroSectionProps) {
  const phone = centerInfo?.phone_admin || '0791586891';
  const mission =
    centerInfo?.mission ||
    'من الصف الأول حتى التوجيهي — أساتذة متميزون، مناهج شاملة، بيئة تعليمية تفاعلية، وتحديات أسبوعية وجوائز للمتفوقين.';

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative flex flex-col justify-between bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] pt-16 sm:pt-20 md:pt-24 pb-0 overflow-hidden text-white font-arabic select-none">
      
      {/* ── 1. Top Announcement Marquee Strip (Continuous Scrolling Ticker) ── */}
      <div className="w-full bg-navy-950/85 backdrop-blur-md border-b border-white/10 py-2.5 overflow-hidden z-30 group select-none">
        <Link href="/quizzes" className="flex items-center" title="جديد منصة القدومي: امتحانات تفاعلية ونقاط فورية">
          <div className="flex w-max">
            {[1, 2].map((trackIdx) => (
              <div
                key={trackIdx}
                className="flex items-center gap-8 sm:gap-12 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] text-xs sm:text-sm font-medium text-slate-200 px-4 sm:px-6 shrink-0"
                style={{ animationDuration: '30s' }}
                aria-hidden={trackIdx === 2}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-accent animate-ping" />
                  <Flame className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-bold text-cyan-accent-300">جديد منصة القدومي:</span>
                  <span className="text-white">امتحانات تفاعلية ونقاط فورية ومكافآت قيّمة للطلاب المتفوقين</span>
                  <span className="text-gold-300 font-bold">⭐ ابدأ التحدي الآن واحصد النقاط!</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-accent animate-ping" />
                  <Flame className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-bold text-cyan-accent-300">جديد منصة القدومي:</span>
                  <span className="text-white">امتحانات تفاعلية ونقاط فورية</span>
                  <span className="text-gold-300 font-bold">⭐ اختبر معلوماتك وتحدى زملاءك!</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-accent animate-ping" />
                  <Flame className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-bold text-cyan-accent-300">جديد منصة القدومي:</span>
                  <span className="text-white">امتحانات تفاعلية ونقاط فورية ومكافآت قيّمة</span>
                  <span className="text-gold-300 font-bold">⭐ ابدأ الآن!</span>
                </span>
                <span className="text-slate-600">•</span>
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* ── 2. Background Atmosphere & Subtle Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Organic Cyan Blob */}
        <OrganicBlob
          variant="cyan"
          size="2xl"
          className="-top-32 -right-32 opacity-40"
          duration={18}
          blur="3xl"
        />

        {/* Deep Navy Backdrop Blob behind center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-2xl h-72 sm:h-88 bg-navy-900/60 rounded-[80px] blur-3xl pointer-events-none -z-10" />

        {/* Subtle grid mesh */}
        <div 
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      {/* ── 5. Main Hero Content ── */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-5 sm:pt-10 sm:pb-8 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Main Headline: Jo Academy Style */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 sm:mb-4 leading-[1.2]"
          >
            <span className="text-white drop-shadow-sm">
              مركز القدومي{' '}
            </span>
            <span className="bg-gradient-to-r from-cyan-accent via-cyan-accent-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
              التعليمي
            </span>
          </motion.h1>

          {/* Subtitle / Mission */}
          <motion.p
            variants={itemVariants}
            className="text-slate-200/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-5 sm:mb-7 leading-relaxed font-normal"
          >
            {mission}
          </motion.p>

          {/* CTA Buttons: Full-width rounded pills stacked vertically on mobile with clear hierarchy */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto max-w-sm sm:max-w-none"
          >
            {/* Primary CTA - Full-width rounded pill */}
            <Link
              href="/quizzes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-accent via-cyan-500 to-cyan-600 hover:from-cyan-accent-400 hover:to-cyan-accent text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-accent/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>ابدأ الاختبارات التفاعلية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* Secondary CTA - WhatsApp - Full-width rounded glass pill */}
            <a
              href={whatsappLink(phone, 'أهلًا، أود الاستفسار عن التسجيل والدورات في مركز القدومي')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-cyan-accent-300" />
              <span>تواصل عبر واتساب</span>
            </a>
          </motion.div>

          {/* Tertiary Teacher Link */}
          <motion.div variants={itemVariants} className="mt-3">
            <Link
              href="/teachers"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-300/80 hover:text-white transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-accent-300" />
              <span>أو تصفح نخبة كادر المعلمين المتميزين</span>
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── 6. Clean White Convex Curved Wave Divider (Jo Academy Alignment) ── */}
      <div className="relative w-full z-20 pointer-events-none -mt-1 leading-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block text-white fill-current"
          aria-hidden="true"
        >
          <path d="M0,40 C360,110 1080,110 1440,40 L1440,120 L0,120 Z" fill="#FFFFFF" />
        </svg>
      </div>
    </section>
  );
}
