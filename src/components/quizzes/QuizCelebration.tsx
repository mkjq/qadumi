'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Trophy, Star, Sparkles, CheckCircle2, RotateCcw, ArrowLeft, LayoutDashboard, HelpCircle, XCircle } from 'lucide-react';


export interface QuizCelebrationProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  pointsEarned: number;
  newTotalPoints: number;
  level: string;
  onReviewClick: () => void;
  onRetakeClick: () => void;
}

export default function QuizCelebration({
  score,
  correctAnswers,
  totalQuestions,
  pointsEarned,
  newTotalPoints,
  level,
  onReviewClick,
  onRetakeClick,
}: QuizCelebrationProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [windowDim, setWindowDim] = useState({ w: 1000, h: 1000 });

  useEffect(() => {
    setWindowDim({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate score counter up
  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      setDisplayScore(Math.round(progress * score));
      if (progress >= 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [score]);

  const isSuccess = score >= 60;
  
  const getEncouragement = () => {
    if (score >= 90) {
      return {
        title: '🌟 أداء استثنائي!',
        subtitle: 'أنت بطل حقيقي! جاهز تماماً لامتحانات التوجيهي والمدرسة.',
        gradient: 'from-amber-400 to-amber-600',
        ringColor: '#F59E0B',
      };
    }
    if (score >= 75) {
      return {
        title: '👏 رائع ومبهر!',
        subtitle: 'خطوات بسيطة تفصلك عن القمة. أنت في الطريق الصحيح.',
        gradient: 'from-cyan-400 to-cyan-600',
        ringColor: '#06B6D4',
      };
    }
    if (score >= 60) {
      return {
        title: '👍 نجاح ممتاز!',
        subtitle: 'اجتزت الاختبار بنجاح، استمر في التدريب لتحقيق الأفضل.',
        gradient: 'from-emerald-400 to-emerald-600',
        ringColor: '#10B981',
      };
    }
    return {
      title: '💪 لا تستسلم!',
      subtitle: 'الأخطاء هي أفضل معلم. راجع إجاباتك وحاول مرة أخرى.',
      gradient: 'from-rose-500 to-rose-700',
      ringColor: '#F43F5E',
    };
  };

  const encouragement = getEncouragement();
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-8 sm:py-16 text-center font-arabic" dir="rtl">
      {/* Confetti Effect (only on win) */}
      {isSuccess && (
        <Confetti
          width={windowDim.w}
          height={windowDim.h}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 rounded-3xl border border-white/10 bg-[#091C3B]/80 p-8 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        {/* Glow behind card */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] bg-gradient-to-b ${encouragement.gradient} opacity-20 pointer-events-none`} />

        {/* Circular Progress Score Indicator */}
        <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 144 144">
            {/* Background Ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            {/* Foreground Animated Ring */}
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              fill="none"
              stroke={encouragement.ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              style={{ filter: `drop-shadow(0 0 8px ${encouragement.ringColor}80)` }}
            />
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-4xl font-black text-white"
            >
              {displayScore}%
            </motion.div>
          </div>
        </div>

        {/* Result Message */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`text-2xl sm:text-3xl font-black mb-3 bg-gradient-to-r ${encouragement.gradient} bg-clip-text text-transparent`}
          >
            {encouragement.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-base text-slate-300 font-medium leading-relaxed max-w-md mx-auto"
          >
            {encouragement.subtitle}
          </motion.p>
        </div>

        {/* Detailed Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8 grid grid-cols-2 gap-4"
        >
          {/* Stat 1: Correct Answers */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {correctAnswers} <span className="text-sm font-medium text-slate-400">/ {totalQuestions}</span>
            </div>
            <div className="text-xs font-bold text-slate-400 mt-1">الإجابات الصحيحة</div>
          </div>

          {/* Stat 2: Points Earned */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/20">
              <Star className="w-5 h-5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              +{pointsEarned}
            </div>
            <div className="text-xs font-bold text-amber-400 mt-1">نقاط مكتسبة</div>
          </div>
        </motion.div>

        {/* Level Up Progress Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-10 rounded-2xl bg-navy-900/50 p-4 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-300">مجموع نقاطك الحالي:</span>
            <span className="text-cyan-400 font-black text-sm flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {newTotalPoints}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full w-[70%]" />
            </div>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-900/50 px-2 py-0.5 rounded-md border border-cyan-500/30">
              {level}
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <button
            onClick={onReviewClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
          >
            <HelpCircle className="w-5 h-5" />
            <span>مراجعة الإجابات الصحيحة</span>
          </button>
          
          <button
            onClick={onRetakeClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>إعادة الاختبار</span>
          </button>
        </motion.div>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>العودة للوحة تحكم الطالب</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
