'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  Sparkles,
  Trophy,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  FileText,
} from 'lucide-react';
import DynamicLogo from './DynamicLogo';
import { whatsappLink } from '@/lib/utils';

interface NavLinkItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

const navLinks: NavLinkItem[] = [
  { href: '/', label: 'الرئيسية' },
  { href: '/grades', label: 'البرامج الدراسية' },
  { href: '/teachers', label: 'كادر المعلمين' },
  { href: '/materials', label: 'الدوسيات' },
  { href: '/store', label: 'البطاقات' },
  { href: '/about', label: 'عن المركز' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const headerClass = isScrolled
    ? 'bg-white/95 backdrop-blur-md shadow-md text-navy-900 py-3 border-b border-slate-100'
    : 'bg-transparent text-white py-4 border-b border-white/10';

  const logoColor = isScrolled ? 'text-navy-900' : 'text-white';
  const linkColor = isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-white';
  const activeLinkClass = isScrolled ? 'text-cyan-600 font-bold' : 'text-cyan-400 font-bold';

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 font-arabic ${headerClass}`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* ================= DESKTOP LAYOUT ================= */}
          <div className="hidden lg:flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <DynamicLogo withText={false} className="w-14 h-14 group-hover:scale-105 transition-transform drop-shadow-md" />
            </Link>

            {/* Main Navigation Links */}
            <nav className="flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base transition-colors ${isActive ? activeLinkClass : linkColor}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Call to Actions (Quizzes, Portal, WhatsApp) */}
            <div className="flex items-center gap-3">
              <Link
                href="/quizzes"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  isScrolled
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                }`}
              >
                <BookOpen size={15} />
                <span>الامتحانات</span>
              </Link>
              
              <Link
                href="/student/dashboard"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  isScrolled
                    ? 'bg-slate-100 text-navy-900 hover:bg-slate-200'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Trophy size={15} className={isScrolled ? "text-amber-500" : "text-amber-400"} />
                <span>النقاط</span>
              </Link>

              <Link
                href={whatsappLink('0791586891')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-amber-500 text-navy-900 hover:bg-amber-400 transition-all shadow-md"
              >
                <Phone size={16} />
                <span>تواصل معنا</span>
              </Link>
            </div>
          </div>

          {/* ================= MOBILE LAYOUT ================= */}
          <div className="flex lg:hidden items-center justify-between">
            {/* Right: Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`p-2 -mr-2 rounded-xl transition-colors ${
                isScrolled ? 'text-navy-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="فتح القائمة"
            >
              <Menu size={28} />
            </button>

            {/* Center: Logo */}
            <Link href="/" className="flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <DynamicLogo withText={false} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" />
            </Link>

            {/* Left: Quick Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/quizzes"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  isScrolled ? 'bg-cyan-50 text-cyan-600' : 'bg-white/10 text-white'
                }`}
              >
                <BookOpen size={18} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SIDE DRAWER ================= */}
      {/* Dark Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <DynamicLogo className="w-10 h-10" withText={false} />
            <div className="flex flex-col">
              <span className="font-black text-navy-900 text-lg leading-tight">مركز القدومي</span>
              <span className="text-[11px] text-cyan-600 font-bold">المنصة التعليمية</span>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full bg-slate-200/50 text-slate-500 hover:text-navy-900 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3.5 rounded-xl font-bold text-base transition-colors ${
                  isActive 
                    ? 'bg-cyan-50 text-cyan-700' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-cyan-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="my-4 border-t border-slate-100" />
          
          <Link
            href="/quizzes"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base text-navy-900 hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            الامتحانات التفاعلية
            <span className="mr-auto text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">جديد</span>
          </Link>
          
          <Link
            href="/student/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base text-navy-900 hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Trophy size={16} />
            </div>
            بوابة الطالب (نقاطي)
          </Link>
        </nav>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <Link
            href={whatsappLink('0791586891')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-cyan rounded-xl py-3 font-bold flex items-center justify-center gap-2 text-white shadow-md"
          >
            <Phone size={18} />
            <span>تواصل معنا عبر واتساب</span>
          </Link>
        </div>
      </div>
    </>
  );
}
