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
  const info = await prisma.centerInfo.findMany();
  return Object.fromEntries(info.map((i) => [i.key, i.value]));
}

export default async function ContactPage() {
  const centerInfo = await getCenterInfo();

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto mb-6 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl text-white/80">
            نحن سعداء بالإجابة على استفساراتك
          </p>
        </div>
      </section>

      <ContactSection centerInfo={centerInfo} />
    </div>
  );
}
