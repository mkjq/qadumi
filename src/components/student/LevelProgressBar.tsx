'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ChevronLeft, HelpCircle } from 'lucide-react';

export interface PrestigeInfo {
  level: string;
  minPoints: number;
  maxPoints: number;
  nextLevel: string | null;
  progressPercent: number;
}

export interface LevelProgressBarProps {
  points: number;
  prestige?: PrestigeInfo;
  onOpenRoadmap?: () => void;
}

const tierConfig: Record<string, { badgeBg: string; text: string; barGradient: string }> = {
  'مبتدئ': {
    badgeBg: 'bg-white/10 border-slate-300 text-slate-700',
    text: 'text-slate-700',
    barGradient: 'from-slate-400 to-cyan-500',
  },
  'متقدم': {
    badgeBg: 'bg-cyan-50 border-cyan-300 text-cyan-700',
    text: 'text-cyan-700',
    barGradient: 'from-cyan-500 to-blue-600',
  },
  'بطل القدومي': {
    badgeBg: 'bg-purple-50 border-purple-300 text-purple-700',
    text: 'text-purple-700',
    barGradient: 'from-purple-500 to-amber-500',
  },
  'أسطورة القدومي': {
    badgeBg: 'bg-amber-50 border-amber-300 text-amber-700',
    text: 'text-amber-700',
    barGradient: 'from-amber-400 via-gold-500 to-amber-600',
  },
};

export default function LevelProgressBar({ points, prestige, onOpenRoadmap }: LevelProgressBarProps) {
  const currentLevel = prestige?.level || 'مبتدئ';
  const nextLevel = prestige?.nextLevel;
  const progressPercent = prestige?.progressPercent ?? Math.min(100, Math.round((points / 100) * 100));
  const maxPoints = prestige?.maxPoints ?? 100;
  const remainingPoints = nextLevel ? Math.max(0, maxPoints - points) : 0;

  const config = tierConfig[currentLevel] || tierConfig['مبتدئ'];

  return (
    <div className="w-full">
      {/* Tier Labels Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenRoadmap}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition hover:brightness-95 active:scale-95 cursor-pointer ${config.badgeBg}`}
            title="انقر لعرض خارطة الرتب والمكافآت"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>رتبتك: {currentLevel}</span>
          </button>

          {onOpenRoadmap && (
            <button
              type="button"
              onClick={onOpenRoadmap}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800 underline underline-offset-2 flex items-center gap-1 transition"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>خارطة الرتب</span>
            </button>
          )}
        </div>

        {nextLevel ? (
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <span>الرتبة القادمة:</span>
            <span className="text-cyan-700 font-extrabold">{nextLevel}</span>
          </div>
        ) : (
          <span className="text-xs font-bold text-amber-600">أعلى رتبة شرفية أسطورية 👑</span>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/10/70 shadow-inner">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${config.barGradient} shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Progress Footer Meta */}
      <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400">
        <span className="font-semibold">{progressPercent}% إنجاز المستوى</span>
        {nextLevel ? (
          <span>
            بقي <strong className="text-slate-100 font-bold">{remainingPoints}</strong> نقطة للترقية إلى {nextLevel}
          </span>
        ) : (
          <span className="font-bold text-amber-600">أنت في قمة المتفوقين</span>
        )}
      </div>
    </div>
  );
}
