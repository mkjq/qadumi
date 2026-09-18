import { prisma } from '@/lib/db';
import DynamicLogo from '@/components/DynamicLogo';
import ContactSection from '@/components/home/ContactSection';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تواصل معنا | مركز القدومي الثقافي',
  description: 'تواصل مع إدارة مركز القدومي الثقافي - نحن هنا لخدمتكم والإجابة عن جميع استفساراتكم',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCenterInfo() {
  try {
    const info = await prisma.centerInfo.findMany();
    return Object.fromEntries(info.map((i) => [i.key, i.value]));
  } catch (err) {
    console.error('[Contact] Error loading centerInfo:', err);
    return {};
  }
}

export default async function ContactPage() {
  const centerInfo = await getCenterInfo();

  return (
    <div className="min-h-screen bg-slate-50/70 font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero ── */}
      <section className="relative bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-28 sm:pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-xs sm:text-sm font-bold mb-6 border border-amber-500/30">
            <Sparkles size={14} />
            <span>خدمة واستفسارات مستمرة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-white">
            تواصل مع <span className="gradient-text-gold">مركز القدومي</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            نسعد دائماً باستقبال استفساراتكم واقتراحاتكم وزيارتكم في مقر المركز
          </p>
        </div>
      </section>

      {/* ── 2. Contact Section ── */}
      <ContactSection centerInfo={centerInfo} />
    </div>
  );
}
