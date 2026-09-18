'use client';

import React from 'react';
import OrganicBlob from '@/components/ui/OrganicBlob';

export default function DashboardSkeleton() {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/20 to-white pt-28 pb-20 overflow-hidden"
      dir="rtl"
      aria-label="جاري تحميل لوحة تحكم الطالب"
    >
      {/* Background Blobs for ambient aesthetic */}
      <OrganicBlob variant="cyan" size="2xl" className="-top-36 -right-36 opacity-30 pointer-events-none" />
      <OrganicBlob variant="gold" size="xl" className="top-1/3 -left-48 opacity-20 pointer-events-none" />
      <OrganicBlob variant="electric" size="lg" className="bottom-20 right-10 opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Header Skeleton */}
        <div className="rounded-3xl border border-white/10/80 bg-white/5/90 p-6 sm:p-8 shadow-sm backdrop-blur-md mb-8 animate-pulse">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar circle */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-white/20" />
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 sm:h-8 w-40 sm:w-52 rounded-xl bg-white/20" />
                  <div className="h-5 w-16 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-28 rounded-lg bg-white/20" />
                  <div className="h-4 w-24 rounded-lg bg-white/20" />
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              <div className="h-11 w-36 rounded-2xl bg-white/20" />
              <div className="h-11 w-20 rounded-2xl bg-white/20" />
            </div>
          </div>
        </div>

        {/* Tier 2: Hero Points & Prestige Progression Skeleton */}
        <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/20 to-gold-500/5 p-6 sm:p-8 shadow-md backdrop-blur-xl mb-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Points Counter Placeholder */}
            <div className="lg:col-span-5 space-y-3">
              <div className="h-4 w-36 rounded-lg bg-amber-200/70" />
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-200/80" />
                <div className="h-10 w-44 rounded-2xl bg-amber-200/70" />
              </div>
              <div className="h-4 w-5/6 rounded-lg bg-white/20" />
            </div>

            {/* Right: Level Progress Bar Track */}
            <div className="lg:col-span-7 bg-white/5/80 rounded-2xl p-6 border border-white/10/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-28 rounded-full bg-white/20" />
                <div className="h-5 w-32 rounded-lg bg-white/20" />
              </div>
              <div className="h-3 w-full rounded-full bg-white/20" />
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 rounded-lg bg-white/20" />
                <div className="h-4 w-32 rounded-lg bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: Stats Grid Skeleton (3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10/80 bg-white/5/90 p-6 shadow-sm backdrop-blur-md animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-28 rounded-lg bg-white/20" />
                <div className="h-10 w-10 rounded-xl bg-white/20" />
              </div>
              <div className="h-8 w-20 rounded-xl bg-white/20 mb-2" />
              <div className="h-3 w-36 rounded-lg bg-white/20" />
            </div>
          ))}
        </div>

        {/* Tier 4: Enrolled Courses Section Skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-6 w-48 rounded-xl bg-white/20" />
              <div className="h-4 w-64 rounded-lg bg-white/20" />
            </div>
            <div className="h-5 w-24 rounded-lg bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10/80 bg-white/5/90 p-6 shadow-sm backdrop-blur-md space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/20" />
                    <div className="space-y-1.5">
                      <div className="h-5 w-28 rounded-lg bg-white/20" />
                      <div className="h-3 w-16 rounded-md bg-white/20" />
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full bg-white/20" />
                </div>
                <div className="h-3.5 w-full rounded-lg bg-white/20" />
                <div className="h-3.5 w-3/4 rounded-lg bg-white/20" />
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-10 rounded-xl bg-white/20" />
                  <div className="h-10 rounded-xl bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 5: Recent Ledger & Activity Skeleton */}
        <div className="rounded-3xl border border-white/10/80 bg-white/5/90 p-6 sm:p-8 shadow-sm backdrop-blur-md mb-8 animate-pulse space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-28 rounded-xl bg-white/20" />
              <div className="h-10 w-32 rounded-xl bg-white/20" />
            </div>
            <div className="h-5 w-24 rounded-lg bg-white/20" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-40 rounded-lg bg-white/20" />
                    <div className="h-3 w-24 rounded-md bg-white/20" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardSkeleton };
