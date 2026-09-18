'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Lottie from 'react-lottie-player';

export default function NotFound() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/icons/404.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading 404 lottie:", err));
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-navy font-arabic px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center max-w-lg w-full text-center"
      >
        <div className="w-64 h-64 sm:w-80 sm:h-80 mb-6">
          {animationData ? (
            <Lottie play loop animationData={animationData} style={{ width: '100%', height: '100%' }} />
          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse rounded-full" />
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black mb-4 text-navy">
          الصفحة غير موجودة
        </h1>
        <p className="text-slate-500 mb-8 max-w-md">
          عذراً، يبدو أن الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-accent via-cyan-500 to-cyan-600 hover:from-cyan-accent-400 hover:to-cyan-accent text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-accent/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span>العودة للصفحة الرئيسية</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
