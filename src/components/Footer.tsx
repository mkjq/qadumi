import Link from 'next/link';
import { Phone, MapPin, Clock, Facebook, ArrowUpRight } from 'lucide-react';
import DynamicLogo from './DynamicLogo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-800 text-white">
      {/* Top CTA bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
            <div>
              <h3 className="text-white font-black text-2xl mb-1">
                هل أنت مستعد للتفوق؟ <span className="text-cyan-accent">ابدأ الآن!</span>
              </h3>
              <p className="text-white/70">انضم إلى آلاف الطلاب الناجحين في مركز القدومي</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a href="tel:0791586891" className="btn-cyan flex items-center justify-center gap-2 whitespace-nowrap">
                <Phone className="w-4 h-4" />
                <span className="ltr font-bold">0791586891</span>
              </a>
              <Link href="/contact" className="btn-outline-white flex items-center justify-center gap-2 whitespace-nowrap">
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
              <div className="relative w-14 h-14 bg-white rounded-xl p-1 overflow-hidden transition-all group-hover:scale-105">
                <DynamicLogo withText={false} fill className="object-contain" />
              </div>
              <div>
                <p className="text-white font-black text-lg">مركز القدومي الثقافي</p>
                <p className="text-cyan-accent text-sm font-medium">عطاء • إخلاص • تميز</p>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-sm">
              من أعرق المراكز التعليمية في المنطقة. تأسس عام 2000م، وبفضل الله تعالى ساهم في تعليم ما يقارب 50 ألف طالب وطالبة.
            </p>
            <p className="text-gold italic text-sm font-medium">"يدًا بيد لبناء جيل متعلم ومفكر"</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { href: '/', l: 'الرئيسية' },
                { href: '/about', l: 'من نحن' },
                { href: '/teachers', l: 'أساتذتنا' },
                { href: '/courses', l: 'المواد الدراسية' },
                { href: '/contact', l: 'تواصل معنا' },
              ].map(({ href, l }) => (
                <li key={href}>
                  <Link href={href} className="text-white/70 hover:text-cyan-accent transition-colors text-sm flex items-center gap-2 group font-medium">
                    <span className="text-cyan-accent/0 group-hover:text-cyan-accent transition-colors">›</span>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base uppercase tracking-wider">تواصل</h4>
            <div className="space-y-4">
              {[
                { Icon: Phone, v: '0791586891', href: 'tel:0791586891', ltr: true },
                { Icon: Clock, v: '2:00م – 9:00م', href: null, ltr: false },
                { Icon: MapPin, v: 'ضاحية الأمير حسن', href: 'https://maps.app.goo.gl/P37KjSNqQ7U3j16e8', ltr: false },
              ].map(({ Icon, v, href, ltr }, i) => {
                const inner = (
                  <div key={i} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-accent/20 transition-colors">
                      <Icon className="w-4 h-4 text-cyan-accent flex-shrink-0" />
                    </div>
                    <span className={`text-sm font-medium ${ltr ? 'ltr' : ''}`}>{v}</span>
                  </div>
                );
                return href ? <a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{inner}</a> : inner;
              })}
              <a href="https://www.facebook.com/share/1HvqSPwcCK/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#1877F2] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#1877F2]/20 transition-colors">
                  <Facebook className="w-4 h-4 text-[#1877F2] flex-shrink-0" />
                </div>
                <span className="text-sm font-medium">صفحة الفيسبوك</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-navy-950/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center sm:text-right font-medium">© {year} مركز القدومي الثقافي — جميع الحقوق محفوظة</p>
          <p className="text-white/50 text-sm text-center sm:text-left font-medium">تأسس 2000م • ما يقارب 50,000 خريج بفضل الله</p>
        </div>
      </div>
    </footer>
  );
}
