'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/store', label: 'المتجر 🛒' },
  { href: '/materials', label: 'الدوسيات' },
  { href: '/about', label: 'عن المركز' },
  { href: '/teachers', label: 'كادر المعلمين' },
  { href: '/courses', label: 'المواد' },
  { href: '/contact', label: 'تواصل معنا' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl theme-header-scroll'
        : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-2 ring-amber-500/30 group-hover:ring-amber-400/60 transition-all duration-300 group-hover:scale-105">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain" priority />
          </div>
          <div className="hidden sm:block">
            <p className="text-white font-bold text-[15px] leading-tight title-text">مركز القدومي الثقافي</p>
            <p className="text-amber-400 text-[11px] font-medium">عطاء • إخلاص • تميز</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </nav>

        {/* CTA + Burger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <a href="tel:0791586891"
            className="hidden sm:flex items-center gap-2 btn-gold text-sm py-2 px-3 sm:py-2.5 sm:px-5">
            <Phone className="w-4 h-4" />
            <span className="ltr">0791586891</span>
          </a>
          <button onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl glass text-white">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden mx-4 mt-2 rounded-2xl glass-dark p-4 border border-white/10">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all font-medium">
              {l.label}
            </Link>
          ))}
          <a href="tel:0791586891"
            className="flex items-center justify-center gap-2 btn-gold w-full mt-3 text-sm">
            <Phone className="w-4 h-4" /> <span className="ltr">0791586891</span>
          </a>
        </div>
      )}
    </header>
  );
}
