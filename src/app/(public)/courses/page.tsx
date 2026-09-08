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
    <div>
      {/* Hero */}
      <section className="gradient-bg py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto mb-6 bg-white/10 rounded-2xl p-2 backdrop-blur border border-white/20">
            <Image src="/logo.jpeg" alt="مركز القدومي" fill className="object-contain rounded-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">المواد الدراسية</h1>
          <p className="text-xl text-white/80">
            من الصف الأول حتى التوجيهي بجميع المواد
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gradeGroups.map((group, i) => (
              <div key={i} className={`card border-2 ${colorMap[group.color]} overflow-hidden`}>
                <div className={`${headerColorMap[group.color]} p-5 text-white`}>
                  <h3 className="text-lg font-bold">{group.title}</h3>
                  <p className="text-white/80 text-sm">{group.grades}</p>
                </div>
                <div className="p-5">
                  <div className="space-y-2">
                    {group.subjects.map((subject) => (
                      <div key={subject} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{subject}</span>
                      </div>
                    ))}
                  </div>
                  {group.note && (
                    <div className="mt-4 bg-gold-50 border border-gold-200 rounded-xl p-3">
                      <p className="text-gold-700 text-sm font-semibold">⭐ {group.note}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-16 gradient-bg rounded-3xl p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">أسعار في متناول الجميع</h2>
            <p className="text-white/80 mb-8">نؤمن بأن التعليم الجيد حق للجميع</p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'أسعار مناسبة', desc: 'أسعار جدًا مناسبة لجميع الفئات' },
                { title: 'خصم المجموعات', desc: 'خصومات خاصة للمجموعات الدراسية' },
                { title: 'خصم الإخوة', desc: 'خصومات إضافية لأبناء العائلة الواحدة' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <h3 className="font-bold text-gold-300 mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-gold inline-flex">
              تواصل لمعرفة الأسعار
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
