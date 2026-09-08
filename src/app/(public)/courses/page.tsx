import Image from 'next/image';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المواد الدراسية | مركز القدومي الثقافي',
  description: 'المواد الدراسية المتاحة في مركز القدومي من الصف الأول حتى التوجيهي',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const gradeGroups = [
  {
    title: 'المرحلة الأساسية الدنيا',
    grades: 'الصف الأول - السادس الأساسي',
    color: 'blue',
    subjects: ['اللغة العربية', 'الرياضيات', 'العلوم', 'اللغة الإنجليزية', 'الاجتماعيات'],
  },
  {
    title: 'المرحلة الأساسية العليا',
    grades: 'الصف السابع - التاسع',
    color: 'purple',
    subjects: ['اللغة العربية', 'الرياضيات', 'العلوم', 'اللغة الإنجليزية', 'الفيزياء', 'الكيمياء', 'الأحياء'],
  },
  {
    title: 'الصف العاشر',
    grades: 'العاشر الأساسي',
    color: 'green',
    subjects: ['اللغة العربية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية'],
  },
  {
    title: 'الأول ثانوي',
    grades: 'الصف الأول الثانوي',
    color: 'orange',
    subjects: ['اللغة العربية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية', 'BETC'],
  },
  {
    title: 'الثاني ثانوي - التوجيهي',
    grades: 'الصف الثاني الثانوي',
    color: 'red',
    subjects: ['اللغة العربية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية'],
    note: 'نسبة نجاح 99% في مادة اللغة العربية',
  },
];

const colorMap: Record<string, string> = {
  blue: 'border-blue-300 bg-blue-50',
  purple: 'border-purple-300 bg-purple-50',
  green: 'border-green-300 bg-green-50',
  orange: 'border-orange-300 bg-orange-50',
  red: 'border-red-300 bg-red-50',
};

const headerColorMap: Record<string, string> = {
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  green: 'bg-green-600',
  orange: 'bg-orange-500',
  red: 'bg-red-600',
};

export default function CoursesPage() {
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
          <div className="section-label mx-auto mb-4 w-fit">من الأساسي حتى التوجيهي</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            المواد <span className="gradient-text">الدراسية</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
            تغطية شاملة وشرح وافٍ لجميع المواد والمستويات الأكاديمية والمهنية
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 section-bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gradeGroups.map((group, i) => (
              <div key={i} className={`card border-2 ${colorMap[group.color]} overflow-hidden shadow-md flex flex-col`}>
                <div className={`${headerColorMap[group.color]} p-5 text-white`}>
                  <h3 className="text-base sm:text-lg font-black leading-snug">{group.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-0.5">{group.grades}</p>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {group.subjects.map((subject) => (
                      <div key={subject} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-semibold">{subject}</span>
                      </div>
                    ))}
                  </div>
                  {group.note && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3">
                      <p className="text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold">⭐ {group.note}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-14 sm:mt-16 gradient-bg rounded-3xl p-6 sm:p-10 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">أسعار في <span className="gradient-text">متناول الجميع</span></h2>
            <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto">نؤمن بأن التعليم الجيد حق للجميع، ونسعى دائمًا لتقديم أفضل قيمة لأبنائنا الطلبة</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
              {[
                { title: 'أسعار مناسبة', desc: 'أسعار جدًا مناسبة ومدروسة لجميع الفئات' },
                { title: 'خصم المجموعات', desc: 'خصومات استثنائية للمجموعات الطلابية' },
                { title: 'خصم الإخوة', desc: 'خصومات إضافية خاصة لأبناء العائلة الواحدة' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center">
                  <h3 className="font-black text-amber-400 mb-1.5 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-gold inline-flex items-center justify-center gap-2 text-sm sm:text-base py-3 px-8 w-full sm:w-auto">
              تواصل لمعرفة الأسعار والتسجيل
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
