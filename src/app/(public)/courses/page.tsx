import { BookOpen, CheckCircle2, Star, ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المواد الدراسية | مركز القدومي الثقافي',
  description: 'المواد والبرامج الدراسية المتاحة في مركز القدومي من الصف الأول حتى التوجيهي والبرنامج المهني BTEC',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const gradeGroups = [
  {
    title: 'المرحلة الأساسية الأولى (١ - ٤)',
    grades: 'الصف الأول حتى الرابع الأساسي',
    slug: 'first-grade',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    headerGradient: 'from-emerald-600 to-teal-700',
    subjects: ['اللغة العربية', 'الرياضيات', 'العلوم العامة', 'اللغة الإنجليزية', 'التربية الإسلامية'],
  },
  {
    title: 'المرحلة العليا (٥ - ٩)',
    grades: 'الصف الخامس حتى التاسع الأساسي',
    slug: 'fifth-grade',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    headerGradient: 'from-indigo-600 to-navy-800',
    subjects: ['اللغة العربية', 'الرياضيات', 'العلوم العامة', 'اللغة الإنجليزية', 'الفيزياء', 'الكيمياء', 'الأحياء'],
  },
  {
    title: 'الصف العاشر الأساسي',
    grades: 'العاشر - مرحلة التأسيس للثانوية',
    slug: 'tenth-grade',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    headerGradient: 'from-blue-600 to-navy-800',
    subjects: ['اللغة العربية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية'],
  },
  {
    title: 'الأول ثانوي الأكاديمي والمهني',
    grades: 'الصف الأول الثانوي بجميع فروعه',
    slug: 'eleventh-grade',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    headerGradient: 'from-amber-600 to-orange-700',
    subjects: ['اللغة العربية المشتركة', 'الرياضيات العلمي والأدبي', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية', 'مواد BTEC'],
  },
  {
    title: 'الثانوية العامة - التوجيهي الأكاديمي',
    grades: 'طلبة التوجيهي (علمي، أدبي، شرعي)',
    slug: 'tawjihi-academic',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
    headerGradient: 'from-navy-900 via-navy-800 to-navy-950',
    subjects: ['اللغة العربية (تخصص ومشترك)', 'الرياضيات العلمي والأدبي', 'الفيزياء', 'الكيمياء', 'العلوم الحياتية', 'اللغة الإنجليزية', 'تاريخ الأردن والتربية الإسلامية'],
    note: 'نسبة نجاح 99% مع نخبة كبار معلمي العاصمة عمان',
  },
  {
    title: 'البرنامج المهني الدولي (BTEC)',
    grades: 'التخصصات المهنية والتقنية الحديثة',
    slug: 'tawjihi-btec',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    headerGradient: 'from-rose-600 to-navy-900',
    subjects: ['تخصص تكنولوجيا المعلومات', 'تخصص الأعمال والإدارة', 'تخصص الهندسة', 'اللغة الإنجليزية المهنية', 'المهارات الحياتية'],
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] text-white font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero Header ── */}
      <section className="relative bg-transparent text-white pt-28 sm:pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-xs sm:text-sm font-bold mb-6 border border-amber-500/30">
            <Star size={14} />
            <span>تغطية شاملة من التأسيس حتى التوجيهي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-white">
            المناهج والمواد <span className="gradient-text-gold">الدراسية</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            برامج تعليمية متكاملة مصممة بعناية فائقة لتأسيس الطلاب وتمكينهم من تحقيق أعلى المراتب
          </p>

          <div className="mt-8">
            <Link
              href="/grades"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-accent hover:bg-cyan-600 text-white font-bold text-sm shadow-lg transition-all hover:scale-105"
            >
              <GraduationCap size={18} />
              <span>استعراض برامج المركز حسب الصف &larr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Grade Groups Grid ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
            {gradeGroups.map((group, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-3xl border border-white/10 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Banner */}
                  <div className={`bg-gradient-to-r ${group.headerGradient} p-6 text-white relative`}>
                    <span className="text-[11px] font-bold text-white/70 block mb-1">{group.grades}</span>
                    <h3 className="text-xl font-black leading-snug">{group.title}</h3>
                  </div>

                  {/* Subject List */}
                  <div className="p-6">
                    <div className="space-y-2.5 mb-6">
                      {group.subjects.map((subject) => (
                        <div key={subject} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-slate-300 text-xs sm:text-sm font-semibold">{subject}</span>
                        </div>
                      ))}
                    </div>

                    {group.note && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-4">
                        <p className="text-amber-800 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                          <span>⭐</span>
                          <span>{group.note}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/grades/${group.slug}`}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-cyan-accent-50 text-slate-300 hover:text-cyan-accent text-xs font-bold border border-white/10 transition-all group"
                  >
                    <span>تفاصيل الصف والمعلمين والدوسيات</span>
                    <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── 3. Academic Pricing Banner ── */}
          <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden border border-white/10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold mb-4 border border-amber-500/30">
              <Star size={14} />
              <span>رسوم في متناول الجميع</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3 text-white">
              تعليم عالي الجودة <span className="gradient-text-gold">بأنسب الأسعار</span>
            </h2>

            <p className="text-slate-300 mb-10 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              نؤمن بأن التعليم المتميز حق لكل طالب، ونقدم باقات مدروسة مع خصومات مميزة للأشقاء والمجموعات
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 max-w-4xl mx-auto">
              {[
                { title: 'أسعار مناسبة', desc: 'أقساط ميسرة ومدروسة لتخفيف العبء عن كاهل أولياء الأمور' },
                { title: 'خصم المجموعات', desc: 'خصومات تشجيعية خاصة عند تسجيل المجموعات الطلابية معاً' },
                { title: 'خصم الإخوة', desc: 'تخفيضات خاصة عند تسجيل أكثر من طالب من العائلة الواحدة' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                  <h3 className="font-black text-amber-400 mb-2 text-base">{item.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link href="/contact" className="btn-gold py-3.5 px-8 text-sm sm:text-base font-black shadow-lg">
              تواصل معنا للاستفسار والتسجيل
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
