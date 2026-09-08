'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, ChevronLeft, Star, GraduationCap, Users } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

interface HeroSectionProps { centerInfo: Record<string, string>; }

export default function HeroSection({ centerInfo }: HeroSectionProps) {
  const phone = centerInfo?.phone_admin || '0791586891';

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden hero-bg">

      {/* Animated background blobs */}
      <div className="absolute top-20 -right-32 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-600/20 blur-[80px] md:blur-[100px] animate-blob" />
      <div className="absolute bottom-10 -left-32 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-purple-600/20 blur-[80px] md:blur-[100px] animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full bg-amber-500/10 blur-[80px] md:blur-[100px] animate-blob-3" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Floating decorative elements - HIDDEN ON MOBILE */}
      <div className="absolute top-32 left-[5%] xl:left-[10%] animate-float hidden lg:block">
        <div className="glass rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-900" fill="currentColor" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">نسبة نجاح</p>
              <p className="text-amber-400 font-black text-lg leading-none">99%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-48 right-[3%] xl:right-[8%] animate-float-2 hidden lg:block">
        <div className="glass rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">خريجون</p>
              <p className="text-blue-400 font-black text-lg leading-none">+50K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 right-[8%] xl:right-[12%] animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
        <div className="glass rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">خبرة</p>
              <p className="text-green-400 font-black text-lg leading-none">25+ سنة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* Left / Text */}
          <div className="text-center lg:text-right flex flex-col items-center lg:items-start">
            
            {/* Logo on mobile only (replaces the desktop floating logo) */}
            <div className="lg:hidden mb-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20 mx-auto">
                <Image src="/logo.jpeg" alt="مركز القدومي الثقافي" fill className="object-contain rounded-xl" priority />
              </div>
            </div>

            {/* Badge */}
            <div className="section-label mb-6 mx-auto lg:mx-0 text-xs sm:text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              منذ عام 2000م — عطاء لا ينقطع
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.25] lg:leading-[1.1] mb-4 sm:mb-6">
              <span className="text-white">مركز</span>{' '}
              <span className="gradient-text">القدومي</span>
              <br />
              <span className="text-white/90 text-2xl sm:text-4xl lg:text-5xl mt-1.5 sm:mt-2 block">الثقافي</span>
            </h1>

            <p className="text-white/60 text-sm sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
              {centerInfo?.mission || 'من الصف الأول حتى التوجيهي — أساتذة متخصصون، مناهج شاملة، ونتائج مبهرة بفضل الله تعالى'}
            </p>

            {/* Slogan */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-8 sm:mb-10">
              <div className="h-px w-6 sm:w-12 bg-amber-400/50" />
              <span className="text-amber-300/80 italic text-sm sm:text-lg">"{centerInfo?.slogan || 'يدًا بيد لبناء جيل متعلم ومفكر'}"</span>
              <div className="h-px w-6 sm:w-12 bg-amber-400/50 lg:hidden" />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link href="/teachers" className="btn-gold flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8">
                <span>تعرف على أساتذتنا</span>
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <a href={whatsappLink(phone, 'أهلًا، أود الاستفسار عن المركز')}
                target="_blank" rel="noopener noreferrer"
                className="btn-outline-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8">
                <Phone className="w-5 h-5" />
                <span>تواصل معنا</span>
              </a>
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5 text-white/50 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ضاحية الأمير حسن، عمّان
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="ltr">{phone}</span>
              </div>
            </div>
          </div>

          {/* Right / Logo + visual card (Hidden on small mobile, visible on desktop) */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute w-[360px] xl:w-[420px] h-[360px] xl:h-[420px] rounded-full border border-white/5 animate-spin-slow" />
            <div className="absolute w-[280px] xl:w-[340px] h-[280px] xl:h-[340px] rounded-full border border-amber-400/10" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />

            {/* Logo card */}
            <div className="relative gradient-border transform transition-transform hover:scale-105">
              <div className="glass rounded-3xl p-6 xl:p-8 flex flex-col items-center gap-6 w-64 xl:w-72">
                <div className="relative w-32 h-32 xl:w-36 xl:h-36 bg-white/5 rounded-2xl p-3">
                  <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-black text-lg xl:text-xl">مركز القدومي</h3>
                  <p className="text-amber-400 text-sm">الثقافي</p>
                </div>
                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-2 xl:gap-3 w-full">
                  {[
                    { v: `${Math.max(1, new Date().getFullYear() - (parseInt(centerInfo?.founded || '2000') || 2000))}+`, l: 'سنة' },
                    { v: `${Math.round((parseInt(centerInfo?.graduates || '50000') || 50000) / 1000)}K`, l: 'خريج' },
                    { v: `${centerInfo?.successRate || '99'}%`, l: 'نجاح' },
                  ].map(s => (
                    <div key={s.l} className="text-center p-2 rounded-xl bg-white/5">
                      <div className="text-amber-400 font-black text-base xl:text-lg leading-none">{s.v}</div>
                      <div className="text-white/50 text-[10px] xl:text-xs mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" className="hero-wave-fill"/>
        </svg>
      </div>
    </section>
  );
}
