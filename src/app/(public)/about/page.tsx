import { prisma } from '@/lib/db';
import Image from 'next/image';
import { CheckCircle2, GraduationCap, Users, Award, MapPin, Target, Heart, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'من نحن | مركز القدومي الثقافي',
  description: 'تعرف على مركز القدومي الثقافي — من أعرق المراكز التعليمية في الأردن منذ 2000م',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCenterInfo() {
  const info = await prisma.centerInfo.findMany();
  return Object.fromEntries(info.map((i) => [i.key, i.value]));
}

const values = [
  { icon: Target, title: 'رسالتنا', desc: 'تزويد الطلاب بالعلم والمعرفة اللازمة لتحقيق أهدافهم الأكاديمية وتنمية شخصياتهم.' },
  { icon: Heart, title: 'قيمنا', desc: 'الإخلاص والتفاني في العمل، والحرص الشديد على مستوى ونجاح كل طالب.' },
  { icon: Lightbulb, title: 'منهجنا', desc: 'أساليب شرح مبتكرة وسهلة مع مواد تعليمية مصممة بشكل احترافي لضمان الفهم الكامل.' },
];

const milestones = [
  { year: '2000', text: 'تأسيس المركز في ضاحية الأمير حسن' },
  { year: '2005', text: 'توسع المركز وإضافة مواد وأساتذة جدد' },
  { year: '2010', text: 'تخريج أول 10,000 طالب وطالبة' },
  { year: '2015', text: 'الانتشار في عدة مناطق محيطة' },
  { year: '2020', text: 'تخريج 40,000 طالب وطالبة' },
  { year: '2025', text: 'أكثر من 50,000 خريج وخريجة الحمد لله' },
];

export default async function AboutPage() {
  const centerInfo = await getCenterInfo();

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto mb-6 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {centerInfo.slogan || 'يدًا بيد لبناء جيل متعلم ومفكر'}
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title">قصة مركز القدومي</h2>
            <p className="text-gray-600 leading-relaxed text-base">
              {centerInfo.about}
            </p>
            <p className="text-gray-600 leading-relaxed text-base mt-4">
              خرّجَ المركز أكثر من 50 ألف طالب وطالبة على مدار السنوات منذ عام 2000 حتى اليوم، منهم الأطباء والمهندسين والمعلمين وجميع التخصصات، ونأمل أن تكونوا من هؤلاء الأبطال والمبدعين.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Users, value: '+50,000', label: 'خريج وخريجة', color: 'bg-blue-500' },
              { icon: Award, value: '99%', label: 'نسبة النجاح', color: 'bg-gold-500' },
              { icon: GraduationCap, value: '+25', label: 'سنة خبرة', color: 'bg-green-500' },
              { icon: MapPin, value: '4+', label: 'مناطق خدمة', color: 'bg-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((val, i) => (
              <div key={i} className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <val.icon className="w-8 h-8 text-primary-700" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">مسيرتنا عبر السنين</h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-6 relative">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-sm z-10">
                      {m.year}
                    </div>
                    <div className="bg-white rounded-2xl p-5 flex-1 shadow-sm mt-2">
                      <p className="text-gray-700 font-medium">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title">مناطق خدمتنا</h2>
          <p className="section-subtitle">نخدم الطلاب في هذه المناطق وما حولها</p>
          <div className="flex flex-wrap justify-center gap-4">
            {(centerInfo.areas || 'ضاحية الأمير حسن، جبل النزهة، ضاحية الأقصى، طبربور').split('،').map((area) => (
              <div key={area} className="flex items-center gap-2 bg-primary-50 px-6 py-3 rounded-full">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span className="text-primary-800 font-medium">{area.trim()}</span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              تواصل معنا الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
