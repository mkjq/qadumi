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
  try {
    const info = await prisma.centerInfo.findMany();
    return Object.fromEntries(info.map((i) => [i.key, i.value]));
  } catch (err) {
    console.error('[About] Error loading centerInfo:', err);
    return {};
  }
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-bg pt-32 pb-20 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20 shadow-xl">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
          </div>
          <div className="section-label mx-auto mb-4 w-fit">عطاء ممتد منذ عام 2000م</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            من <span className="gradient-text">نحن</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
            {centerInfo.slogan || 'يدًا بيد لبناء جيل متعلم ومفكر'}
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-16 sm:py-20 section-bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="section-title">قصة مركز <span className="gradient-text">القدومي</span></h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
              {centerInfo.about}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base mt-4">
              خرّجَ المركز أكثر من 50 ألف طالب وطالبة على مدار السنوات منذ عام 2000 حتى اليوم، منهم الأطباء والمهندسين والمعلمين وجميع التخصصات، ونأمل أن تكونوا من هؤلاء الأبطال والمبدعين.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {[
              { icon: Users, value: '+50,000', label: 'خريج وخريجة', color: 'bg-blue-600' },
              { icon: Award, value: '99%', label: 'نسبة النجاح', color: 'bg-amber-500' },
              { icon: GraduationCap, value: '+25', label: 'سنة خبرة', color: 'bg-emerald-600' },
              { icon: MapPin, value: '4+', label: 'مناطق خدمة', color: 'bg-purple-600' },
            ].map((stat, i) => (
              <div key={i} className="card p-5 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-primary-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {values.map((val, i) => (
              <div key={i} className="card p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <val.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-700 dark:text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-900 dark:text-white mb-2 sm:mb-3">{val.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 section-bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">مسيرتنا عبر السنين</h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-white/10" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-4 sm:gap-6 relative">
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-primary-800 text-white rounded-2xl flex items-center justify-center font-black text-sm sm:text-base z-10 shadow-lg border border-primary-700">
                      {m.year}
                    </div>
                    <div className="card p-4 sm:p-5 flex-1 mt-1 sm:mt-2">
                      <p className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 sm:py-20 section-bg-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title">مناطق خدمتنا</h2>
          <p className="section-subtitle">نخدم الطلاب في هذه المناطق وما حولها</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {(centerInfo.areas || 'ضاحية الأمير حسن، جبل النزهة، ضاحية الأقصى، طبربور').split('،').map((area) => (
              <div key={area} className="flex items-center gap-2 bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-amber-400" />
                <span className="text-primary-900 dark:text-white text-xs sm:text-sm font-semibold">{area.trim()}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 sm:mt-12">
            <Link href="/contact" className="btn-gold inline-flex items-center gap-2 text-sm sm:text-base py-3 px-8">
              تواصل معنا الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
