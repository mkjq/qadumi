'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, Star, ArrowLeft, Award } from 'lucide-react';

export interface QuizCardProps {
  quiz: {
    id: number;
    title: string;
    description?: string | null;
    subject: string;
    grade: string;
    durationMinutes: number;
    pointsReward: number;
    pointsPerCorrect: number;
    bonusPoints: number;
    passingScore: number;
    questionCount: number;
  };
  index?: number;
}

const subjectColors: Record<string, { badge: string; bg: string; border: string; iconColor: string }> = {
  'الرياضيات': {
    badge: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    bg: 'from-cyan-500/5 to-navy-500/5',
    border: 'hover:border-cyan-400',
    iconColor: 'text-cyan-500',
  },
  'الفيزياء': {
    badge: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    bg: 'from-purple-500/5 to-navy-500/5',
    border: 'hover:border-purple-400',
    iconColor: 'text-purple-500',
  },
  'اللغة العربية': {
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    bg: 'from-emerald-500/5 to-navy-500/5',
    border: 'hover:border-emerald-400',
    iconColor: 'text-emerald-500',
  },
  'الكيمياء': {
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    bg: 'from-amber-500/5 to-navy-500/5',
    border: 'hover:border-amber-400',
    iconColor: 'text-amber-500',
  },
  'اللغة الإنجليزية': {
    badge: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    bg: 'from-rose-500/5 to-navy-500/5',
    border: 'hover:border-rose-400',
    iconColor: 'text-rose-500',
  },
};

export default function QuizCard({ quiz, index = 0 }: QuizCardProps) {
  const theme = subjectColors[quiz.subject] || {
    badge: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    bg: 'from-cyan-500/5 to-navy-500/5',
    border: 'hover:border-cyan-400',
    iconColor: 'text-cyan-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 ${theme.border}`}
    >
      {/* Top subtle ambient gradient */}
      <div
        className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${theme.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div>
        {/* Badges bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badge}`}
            >
              <Star className="w-3.5 h-3.5" />
              {quiz.subject}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {quiz.grade}
            </span>
          </div>

          {/* Reward points chip */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-amber-500/10 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>+{quiz.pointsReward} نقطة</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 transition-colors duration-200 group-hover:text-navy-700 mb-2 leading-snug">
          {quiz.title}
        </h3>

        {/* Description */}
        {quiz.description && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {quiz.description}
          </p>
        )}

        {/* Meta Stats Chips */}
        <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-100">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{quiz.questionCount} أسئلة اختيارية</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-100">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{quiz.durationMinutes} دقيقة</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        <Link
          href={`/quizzes/${quiz.id}`}
          className="group/btn relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-navy-700 via-navy-800 to-cyan-700 px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:from-cyan-600 hover:to-navy-800 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.99]"
        >
          <span>ابدأ الاختبار الآن</span>
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
