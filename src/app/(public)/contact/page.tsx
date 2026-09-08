import { prisma } from '@/lib/db';
import Image from 'next/image';
import ContactSection from '@/components/home/ContactSection';
import type { Metadata } from 'next';
import { Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تواصل معنا | مركز القدومي الثقافي',
  description: 'تواصل مع مركز القدومي الثقافي - نحن هنا لمساعدتك',
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-bg pt-32 pb-20 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20 shadow-xl">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
          </div>
          <div className="section-label mx-auto mb-4 w-fit">خدمة واستفسارات</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            تواصل <span className="gradient-text">معنا</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
            نحن هنا لمساعدتك والإجابة عن أي استفسار بكل سرور
          </p>
        </div>
      </section>

      <ContactSection centerInfo={centerInfo} />
    </div>
  );
}
