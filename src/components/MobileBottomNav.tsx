'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Trophy, GraduationCap, Phone, Star } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname() || '';

  // Streamlined 4 core tabs per Jo Academy pattern
  const tabs = [
    { href: '/', label: 'الرئيسية', icon: Home, hasStar: false },
    { href: '/grades', label: 'الصفوف', icon: GraduationCap, hasStar: false },
    { href: '/quizzes', label: 'امتحانات', icon: FileText, hasStar: true },
    { href: '/student/dashboard', label: 'نقاطي', icon: Trophy, hasStar: false },
  ];

  const isTabActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/student/dashboard') {
      return pathname === '/student/dashboard' || pathname.startsWith('/student');
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] h-16 flex items-center justify-between px-3 sm:px-6 font-arabic select-none"
      dir="rtl"
      aria-label="شريط التنقل السفلي"
    >
      {/* ── 1. Streamlined Navigation Tabs (Right and Center in RTL) ── */}
      <div className="flex-1 flex items-center justify-around h-full pr-1">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center py-1 px-2 focus:outline-none"
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                /* Prominent Raised / Highlighted Active Pill Capsule (Jo Academy Pattern) */
                <div className="relative flex flex-col items-center justify-center bg-white shadow-[0_4px_14px_rgba(0,163,224,0.18)] border border-cyan-100/90 rounded-2xl px-3.5 py-1.5 -translate-y-1.5 transition-all duration-300">
                  <div className="relative">
                    <Icon size={20} className="text-cyan-accent-600 mb-0.5" />
                    {tab.hasStar && (
                      <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-black text-cyan-accent-600 leading-none">
                    {tab.label}
                  </span>
                  {/* Highlighted indicator */}
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent mt-0.5" />
                </div>
              ) : (
                /* Inactive Clean Tab */
                <div className="flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 transition-colors py-1">
                  <div className="relative">
                    <Icon size={20} className="mb-0.5" />
                    {tab.hasStar && (
                      <Star size={10} className="absolute -top-1 -right-1.5 text-gold-400 fill-gold-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-none">
                    {tab.label}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* ── 2. Distinct Standalone Dark Circular FAB Call Button on Left (Jo Academy Pattern) ── */}
      <div className="flex items-center pl-1">
        <a
          href="tel:0791586891"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#07152B] text-white flex items-center justify-center shadow-lg shadow-navy-950/25 hover:bg-navy-900 active:scale-95 transition-all"
          title="اتصال سريع بالمركز"
          aria-label="اتصال سريع بالمركز"
        >
          <Phone size={19} className="text-cyan-accent-300" />
        </a>
      </div>
    </nav>
  );
}
