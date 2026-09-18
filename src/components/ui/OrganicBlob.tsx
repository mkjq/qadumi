'use client';

import React from 'react';
import { motion } from 'framer-motion';

type BlobVariant = 'cyan' | 'navy' | 'gold' | 'electric' | 'subtle';
type BlobSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

interface OrganicBlobProps {
  variant?: BlobVariant;
  size?: BlobSize;
  className?: string;
  duration?: number;
  delay?: number;
  opacity?: number;
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const sizeMap: Record<string, string> = {
  sm: 'w-36 h-36',
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
  xl: 'w-[32rem] h-[32rem]',
  '2xl': 'w-[42rem] h-[42rem]',
};

const blurMap: Record<string, string> = {
  sm: 'blur-md',
  md: 'blur-lg',
  lg: 'blur-xl',
  xl: 'blur-2xl',
  '2xl': 'blur-3xl',
  '3xl': 'blur-[100px]',
};

const gradientStyles: Record<BlobVariant, string> = {
  cyan: 'from-cyan-accent-400/40 via-cyan-accent-500/25 to-navy-400/20',
  navy: 'from-navy-400/40 via-navy-600/30 to-navy-900/50',
  gold: 'from-gold-400/35 via-gold-500/20 to-cyan-accent-400/15',
  electric: 'from-cyan-accent-400/50 via-primary-500/30 to-gold-400/30',
  subtle: 'from-white/15 via-white/5 to-transparent',
};

export default function OrganicBlob({
  variant = 'cyan',
  size = 'lg',
  className = '',
  duration = 14,
  delay = 0,
  opacity = 1,
  blur = '2xl',
}: OrganicBlobProps) {
  const sizeClass = typeof size === 'number' ? '' : sizeMap[size] || sizeMap.lg;
  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : {};
  const blurClass = blurMap[blur] || blurMap['2xl'];
  const gradientClass = gradientStyles[variant] || gradientStyles.cyan;

  return (
    <motion.div
      className={`absolute pointer-events-none select-none bg-gradient-to-br ${gradientClass} ${sizeClass} ${blurClass} ${className}`}
      style={{
        opacity,
        willChange: 'transform, border-radius',
        ...sizeStyle,
      }}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '50% 50% 20% 80% / 25% 75% 40% 60%',
          '65% 35% 55% 45% / 45% 55% 35% 65%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.08, 0.94, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    />
  );
}
