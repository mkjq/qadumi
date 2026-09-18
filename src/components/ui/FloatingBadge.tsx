'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type FloatingBadgeVariant = 'glass' | 'cyan' | 'gold' | 'navy' | 'white';

interface FloatingBadgeProps {
  children?: React.ReactNode;
  icon?: React.ElementType;
  title?: string;
  subtitle?: string;
  variant?: FloatingBadgeVariant;
  delay?: number;
  duration?: number;
  amplitude?: number;
  className?: string;
  pulseGlow?: boolean;
}

const variantStyles: Record<FloatingBadgeVariant, string> = {
  glass: 'bg-white/10 backdrop-blur-xl border border-white/25 text-white shadow-2xl shadow-navy-950/30',
  cyan: 'bg-cyan-accent-500/15 backdrop-blur-xl border border-cyan-accent-400/40 text-cyan-accent-100 shadow-lg shadow-cyan-accent-500/20',
  gold: 'bg-gold-500/15 backdrop-blur-xl border border-gold-400/50 text-gold-200 shadow-lg shadow-gold-500/20',
  navy: 'bg-navy-900/85 backdrop-blur-xl border border-navy-700/60 text-white shadow-2xl shadow-navy-950/40',
  white: 'bg-white/95 backdrop-blur-xl border border-slate-100 text-navy shadow-xl shadow-navy-900/10',
};

export default function FloatingBadge({
  children,
  icon: Icon,
  title,
  subtitle,
  variant = 'glass',
  delay = 0,
  duration = 5,
  amplitude = 12,
  className = '',
  pulseGlow = false,
}: FloatingBadgeProps) {
  return (
    <motion.div
      className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-default select-none font-arabic transition-colors ${
        variantStyles[variant]
      } ${pulseGlow ? 'ring-2 ring-cyan-accent/40 ring-offset-2 ring-offset-navy' : ''} ${className}`}
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -amplitude, 0],
        rotate: [-0.5, 1, -0.5],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: duration * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
      whileHover={{
        scale: 1.08,
        y: -amplitude - 4,
        rotate: 0,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {Icon && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 shrink-0 shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
      )}

      {children ? (
        children
      ) : (
        <div className="flex flex-col text-right leading-tight">
          {title && <span className="font-bold text-sm tracking-wide">{title}</span>}
          {subtitle && <span className="text-xs opacity-80 font-medium">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
}
