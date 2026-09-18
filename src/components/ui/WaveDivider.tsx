'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  fill?: string;
  accentColor?: string;
  secondaryColor?: string;
  className?: string;
  height?: number | string;
  animated?: boolean;
}

export default function WaveDivider({
  position = 'bottom',
  fill = '#FFFFFF',
  accentColor = '#00A3E0',
  secondaryColor = '#1A3461',
  className = '',
  height = '80px',
  animated = true,
}: WaveDividerProps) {
  const isTop = position === 'top';

  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none ${
        isTop ? 'rotate-180 -mb-1' : '-mt-1'
      } ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id="wave-grad-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
            <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="wave-grad-secondary" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.5" />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Back Layer Wave - Flowing Cyan & Navy */}
        {animated ? (
          <motion.path
            d="M0,32 C240,96 480,-10 720,48 C960,106 1200,24 1440,64 L1440,120 L0,120 Z"
            fill="url(#wave-grad-accent)"
            animate={{
              d: [
                'M0,32 C240,96 480,-10 720,48 C960,106 1200,24 1440,64 L1440,120 L0,120 Z',
                'M0,50 C260,10 500,85 740,25 C980,95 1220,10 1440,45 L1440,120 L0,120 Z',
                'M0,32 C240,96 480,-10 720,48 C960,106 1200,24 1440,64 L1440,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <path
            d="M0,32 C240,96 480,-10 720,48 C960,106 1200,24 1440,64 L1440,120 L0,120 Z"
            fill="url(#wave-grad-accent)"
          />
        )}

        {/* Middle Layer Wave - Soft Depth */}
        {animated ? (
          <motion.path
            d="M0,60 C320,15 540,80 840,40 C1100,10 1280,75 1440,50 L1440,120 L0,120 Z"
            fill="url(#wave-grad-secondary)"
            animate={{
              d: [
                'M0,60 C320,15 540,80 840,40 C1100,10 1280,75 1440,50 L1440,120 L0,120 Z',
                'M0,40 C280,75 580,20 860,65 C1120,35 1300,85 1440,65 L1440,120 L0,120 Z',
                'M0,60 C320,15 540,80 840,40 C1100,10 1280,75 1440,50 L1440,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <path
            d="M0,60 C320,15 540,80 840,40 C1100,10 1280,75 1440,50 L1440,120 L0,120 Z"
            fill="url(#wave-grad-secondary)"
          />
        )}

        {/* Foreground Solid Wave - Pure Smooth Clean Cut */}
        <path
          d="M0,75 C200,105 450,45 700,75 C950,105 1250,55 1440,80 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
