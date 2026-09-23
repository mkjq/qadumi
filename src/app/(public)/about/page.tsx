import { prisma } from '@/lib/db';
import DynamicLogo from '@/components/DynamicLogo';
import { CheckCircle2, GraduationCap, Users, Award, MapPin, Target, Heart, Lightbulb, Star, ChevronLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'عن المركز | مركز القدومي الثقافي',
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
  { icon: Target, title: 'رسالتنا التعليمية', desc: 'تزويد الطلاب بالمعرفة العميقة والمهارات اللازمة لتحقيق التميز في امتحانات التوجيهي وكافة المراحل.' },
  { icon: Heart, title: 'قيمنا ومبادئنا', desc: 'الإخلاص والتفاني، والمتابعة الفردية الحثيثة لكل طالب وطالبة لنصنع منهم قصص نجاح حقيقية.' },
  { icon: Lightbulb, title: 'منهجنا وأسلوبنا', desc: 'شروحات مبسطة وشاملة، امتحانات دورية، ودوسيات صممت بأعلى معايير الدقة لتثبيت الفهم.' },
];

const milestones = [
  { year: '2000', text: 'تأسيس مركز القدومي في ضاحية الأمير حسن' },
  { year: '2005', text: 'توسعة المركز واستقطاب نخبة من كبار معلمي المملكة' },
  { year: '2010', text: 'تخريج أول 10,000 طالب وطالبة بمعدلات تفوق' },
  { year: '2015', text: 'انتشار اسم المركز في العاصمة عمان وضواحيها' },
  { year: '2020', text: 'تطوير أساليب التدريس وتقديم أنظمة امتحانات متقدمة' },
  { year: '2025', text: 'أكثر من 50,000 خريج وخريجة يخدمون وطنهم بنجاح' },
];

export default async function AboutPage() {
  const centerInfo = await getCenterInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] text-white font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero Header ── */}
      <section className="relative bg-transparent text-white pt-28 sm:pt-32 pb-20 px-4 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">


          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-white">
            قصة صرح <span className="gradient-text-gold">القدومي الثقافي</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {centerInfo.slogan || 'يدًا بيد لبناء جيل متعلم، متفوق ومتمكن'}
          </p>
        </div>
      </section>

      {/* ── 2. Story Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 rounded-3xl p-8 sm:p-12 border border-white/10 shadow-sm mb-16 hover:bg-white/10 transition-colors duration-500 animate-fade-in-up">
            <div className="max-w-3xl mx-auto text-center">
              <span className="badge-gold mb-4">مسيرة ربع قرن</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
                أكثر من 25 عاماً في خدمة طلبتنا
              </h2>
              <p className="text-slate-300 leading-relaxed text-base sm:text-lg mb-4">
                {centerInfo.about || 'مركز القدومي الثقافي من أعرق المراكز التعليمية في العاصمة عمّان، ويحظى بثقة آلاف الأهالي والطلبة في مناطق ضاحية الأمير حسن، جبل النزهة، ضاحية الأقصى، طبربور والمناطق المحيطة.'}
              </p>
              <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
                بفضل الله تعالى، خرّج المركز ما يزيد عن 50 ألف طالب وطالبة، تفوقوا في امتحانات الثانوية العامة وأصبحوا أطباء ومهندسين ومعلمين وقادة في مختلف المجالات، ونسعد بأن تكون أنت قصة النجاح القادمة.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
            {[
              { icon: Users, value: '+50,000', label: 'طالب وطالبة متخرجين', color: 'from-blue-500 to-cyan-500' },
              { icon: Award, value: '99%', label: 'نسبة النجاح والتفوق', color: 'from-amber-500 to-orange-500' },
              { icon: GraduationCap, value: '+25', label: 'سنة خبرة وتدريس', color: 'from-emerald-500 to-teal-500' },
              { icon: MapPin, value: '4+', label: 'مناطق رئيسية في عمان', color: 'from-purple-500 to-indigo-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 shadow-sm hover:border-cyan-400/60 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-xs sm:text-sm font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Pillars of Excellence */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-20">
            {values.map((val, i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-7 border border-white/10 shadow-sm hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-2 hover:border-amber-400 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto mb-5 text-amber-600">
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white/5 rounded-3xl p-8 sm:p-12 border border-white/10 shadow-sm mb-20 hover:border-amber-500/30 transition-colors duration-500 animate-fade-in-up">
            <div className="text-center mb-10">
              <span className="badge-gold mb-3">محطات الفخر</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">محطات في تاريخ المركز</h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="relative border-r-2 border-amber-300 pr-6 space-y-8">
                {milestones.map((m, i) => (
                  <div key={i} className="relative group hover:scale-[1.02] transition-transform duration-300">
                    {/* Golden Dot */}
                    <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow group-hover:scale-125 transition-transform duration-300" />
                    <div className="text-sm font-black text-amber-600 mb-1">{m.year}م</div>
                    <div className="text-base font-bold text-white">{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Call to Action */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden border border-white/10 shadow-xl animate-fade-in-up hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-500">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">موقع المركز</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              نرحب بطلابنا الأعزاء في مقرنا الرئيسي والوحيد المجهز بأحدث الوسائل التعليمية:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white/5/10 border border-white/15 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>ضاحية الأمير حسن</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/grades" className="btn-cyan py-3.5 px-8 text-sm sm:text-base font-black">
                استعرض البرامج التعليمية
              </Link>
              <Link href="/contact" className="btn-outline-white py-3 px-7 text-sm font-bold">
                تواصل مع الإدارة
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
