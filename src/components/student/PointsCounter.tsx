'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export interface PointsCounterProps {
  points: number;
  duration?: number;
}

export default function PointsCounter({ points, duration = 1200 }: PointsCounterProps) {
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const targetValue = points;

    if (targetValue === 0) {
      setDisplayPoints(0);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (targetValue - startValue) * easeOut);
      setDisplayPoints(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [points, duration]);

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30">
        <Star className="w-6 h-6 fill-white text-white animate-pulse" />
      </div>
      <div>
        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {displayPoints.toLocaleString('ar-EG')}
        </span>
        <span className="mr-2 text-sm font-bold text-amber-600">نقطة</span>
      </div>
    </div>
  );
}
