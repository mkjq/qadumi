import { prisma } from '@/lib/db';
import Image from 'next/image';
import { Phone, Facebook, Instagram, MessageCircle, GraduationCap } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أساتذتنا | مركز القدومي الثقافي',
  description: 'تعرف على نخبة أساتذة مركز القدومي الثقافي المتخصصين',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeachersPage() {
  let teachers: any[] = [];
  try {
    teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.error('[Teachers] Error loading teachers:', err);
  }

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
          <div className="section-label mx-auto mb-4 w-fit">كوكبة متميزة</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            أساتذتنا <span className="gradient-text">المتميزون</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
            نخبة من المعلمين المتخصصين ذوي الخبرة العالية لضمان أعلى المراتب
          </p>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-16 sm:py-20 section-bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card overflow-hidden group flex flex-col h-full shadow-lg">
                {/* Image */}
                <div className="relative h-64 sm:h-72 bg-gradient-to-br from-primary-900 to-primary-800 overflow-hidden">
                  {teacher.image ? (
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-900/30">
                      <GraduationCap className="w-20 h-20 text-white/20" />
                    </div>
                  )}
                  <div className="teacher-img-overlay absolute inset-0" />
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-xl bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-xs sm:text-sm shadow-md">
                    {teacher.subject}
                  </div>
                  <div className="absolute bottom-4 right-4 left-4 z-10">
                    <h2 className="text-xl font-black text-white drop-shadow">أ. {teacher.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Grades */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {teacher.grades.split(',').map((grade: string) => (
                        <span
                          key={grade}
                          className="bg-blue-50 dark:bg-white/5 text-primary-800 dark:text-gray-200 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-100 dark:border-white/10"
                        >
                          {grade.trim()}
                        </span>
                      ))}
                    </div>

                    {teacher.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                        {teacher.bio}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Phone */}
                    {teacher.phone && (
                      <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-2.5 mb-3 flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-primary-600 dark:text-amber-400 flex-shrink-0" />
                        <a href={`tel:${teacher.phone}`} className="text-primary-800 dark:text-white font-bold text-xs sm:text-sm ltr hover:text-amber-500 transition-colors">
                          {teacher.phone}
                        </a>
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                      {teacher.whatsapp && (
                        <a
                          href={whatsappLink(teacher.whatsapp, `أهلًا أستاذ ${teacher.name}، أود الاستفسار`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          واتساب
                        </a>
                      )}
                      {teacher.facebook && (
                        <a
                          href={teacher.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                          فيسبوك
                        </a>
                      )}
                      {teacher.instagram && (
                        <a
                          href={teacher.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          إنستغرام
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {teachers.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>سيتم إضافة الأساتذة قريبًا</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
