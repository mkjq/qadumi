import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Facebook, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#060912] border-t border-white/5">
      {/* Top CTA bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-2xl mb-1">
                هل أنت مستعد للتفوق؟ <span className="gradient-text">ابدأ الآن!</span>
              </h3>
              <p className="text-white/40">انضم إلى آلاف الطلاب الناجحين في مركز القدومي</p>
            </div>
            <div className="flex gap-3">
              <a href="tel:0791586891" className="btn-gold flex items-center gap-2 whitespace-nowrap">
                <Phone className="w-4 h-4" />
                <span className="ltr">0791586891</span>
              </a>
              <Link href="/contact" className="btn-outline-white flex items-center gap-2 whitespace-nowrap">
                تواصل معنا <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-amber-400/30 transition-all">
                <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain" />
              </div>
              <div>
                <p className="text-white font-black text-base">مركز القدومي الثقافي</p>
                <p className="text-amber-400 text-xs">عطاء • إخلاص • تميز</p>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-5 max-w-sm">
              من أعرق المراكز التعليمية في المنطقة. تأسس عام 2000م، وبفضل الله تعالى ساهم في تعليم ما يقارب 50 ألف طالب وطالبة.
            </p>
            <p className="text-amber-400/70 italic text-sm">"يدًا بيد لبناء جيل متعلم ومفكر"</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', l: 'الرئيسية' },
                { href: '/about', l: 'من نحن' },
                { href: '/teachers', l: 'أساتذتنا' },
                { href: '/courses', l: 'المواد الدراسية' },
                { href: '/contact', l: 'تواصل معنا' },
              ].map(({ href, l }) => (
                <li key={href}>
                  <Link href={href} className="text-white/40 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="text-amber-500/0 group-hover:text-amber-500 transition-colors">›</span>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">تواصل</h4>
            <div className="space-y-3">
              {[
                { Icon: Phone, v: '0791586891', href: 'tel:0791586891', ltr: true },
                { Icon: Clock, v: '2:00م – 9:00م', href: null, ltr: false },
                { Icon: MapPin, v: 'ضاحية الأمير حسن', href: 'https://maps.app.goo.gl/P37KjSNqQ7U3j16e8', ltr: false },
              ].map(({ Icon, v, href, ltr }, i) => {
                const inner = (
                  <div key={i} className="flex items-center gap-2.5 text-white/40 hover:text-white/70 transition-colors">
                    <Icon className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
                    <span className={`text-sm ${ltr ? 'ltr' : ''}`}>{v}</span>
                  </div>
                );
                return href ? <a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{inner}</a> : inner;
              })}
              <a href="https://www.facebook.com/share/1HvqSPwcCK/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/40 hover:text-[#1877F2] transition-colors">
                <Facebook className="w-4 h-4 text-[#1877F2]/60 flex-shrink-0" />
                <span className="text-sm">صفحة الفيسبوك</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-sm text-center sm:text-right">© {year} مركز القدومي الثقافي — جميع الحقوق محفوظة</p>
          <p className="text-white/20 text-xs text-center sm:text-left">تأسس 2000م • ما يقارب 50,000 خريج بفضل الله</p>
        </div>
      </div>
    </footer>
  );
}
