import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { parseTaughtGrades, STAGES } from '@/lib/grades';
import { whatsappLink } from '@/lib/utils';
import { Phone, MessageCircle, Facebook, Instagram, GraduationCap, FileText, Download, ChevronLeft, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TeacherProfileProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TeacherProfileProps): Promise<Metadata> {
  const teacherId = parseInt(params.id, 10);
  if (isNaN(teacherId)) return { title: 'المعلم غير موجود' };

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  if (!teacher) return { title: 'المعلم غير موجود | مركز القدومي' };

  return {
    title: `أ. ${teacher.name} - معلم ${teacher.subject} | مركز القدومي الثقافي`,
    description: teacher.bio || `الملف التعريفي للأستاذ ${teacher.name} والصفوف التي يدرسها في مركز القدومي.`,
  };
}

export default async function TeacherProfilePage({ params }: TeacherProfileProps) {
  const teacherId = parseInt(params.id, 10);
  if (isNaN(teacherId)) {
    notFound();
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  if (!teacher || !teacher.isActive) {
    notFound();
  }

  // Parse structured taught grades using the taxonomy engine
  const taughtGrades = parseTaughtGrades(teacher.grades);

  // Fetch all materials authored by this teacher
  const teacherMaterials = await prisma.material.findMany({
    where: {
      isActive: true,
      teacherName: {
        contains: teacher.name,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50/60 font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero Profile Header ── */}
      <section className="relative bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-24 sm:pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} className="text-slate-500" />
            <Link href="/teachers" className="hover:text-white transition-colors">كادر المعلمين</Link>
            <ChevronLeft size={14} className="text-slate-500" />
            <span className="text-cyan-accent font-semibold">أ. {teacher.name}</span>
          </nav>

          {/* Profile Card Intro */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Teacher Avatar Image */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden bg-slate-800 border-4 border-white/10 shadow-2xl flex-shrink-0">
              {teacher.image ? (
                teacher.image.startsWith('data:') ? (
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className={`absolute inset-0 w-full h-full object-cover ${teacher.imagePosition || 'object-center'}`}
                  />
                ) : (
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    priority
                    className={`object-cover ${teacher.imagePosition || 'object-center'}`}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cyan-accent-500 text-white font-black text-4xl">
                  {teacher.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Teacher Details */}
            <div className="flex-1 text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-accent-500/15 text-cyan-accent text-xs font-bold mb-3 border border-cyan-accent-500/20">
                <Sparkles size={13} />
                <span>مدرس مادة {teacher.subject}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                أ. {teacher.name}
              </h1>

              {teacher.bio && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                  {teacher.bio}
                </p>
              )}

              {/* Direct Contact Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {teacher.whatsapp && (
                  <a
                    href={whatsappLink(teacher.whatsapp, `مرحباً أستاذ ${teacher.name}، أود الاستفسار عن دروسك في مركز القدومي`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                  >
                    <MessageCircle size={16} />
                    <span>مراسلة عبر واتساب</span>
                  </a>
                )}
                {teacher.phone && (
                  <a
                    href={`tel:${teacher.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs sm:text-sm transition-all"
                  >
                    <Phone size={15} />
                    <span>{teacher.phone}</span>
                  </a>
                )}
                {teacher.facebook && (
                  <a
                    href={teacher.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white transition-colors"
                    title="فيسبوك"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {teacher.instagram && (
                  <a
                    href={teacher.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-white transition-colors"
                    title="انستغرام"
                  >
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Taught Grades Showcase (Core Requirement R3) ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 space-y-16">
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-accent-50 text-cyan-accent-600 flex items-center justify-center">
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900">الصفوف التي يدرسها الأستاذ</h2>
                <p className="text-slate-400 text-xs mt-0.5">اضغط على أي صف للاطلاع على المنهاج والدوسيات الخاصة به</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {taughtGrades.length} صفوف دراسية
            </span>
          </div>

          {taughtGrades.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              يُدرّس الأستاذ المراحل العامة للمركز.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {taughtGrades.map((grade) => (
                <Link
                  key={grade.slug}
                  href={`/grades/${grade.slug}`}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-cyan-accent-50/60 border border-slate-200/70 hover:border-cyan-accent-300 transition-all shadow-sm hover:shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-navy-900 text-white font-black text-sm flex items-center justify-center group-hover:bg-cyan-accent group-hover:scale-105 transition-all">
                      {grade.numeral}
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 text-sm group-hover:text-cyan-accent transition-colors">
                        {grade.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {grade.stageName}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-cyan-accent rotate-180 group-hover:-translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. Teacher's Dousies & Materials ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900">دوسيات وملخصات أ. {teacher.name}</h2>
                <p className="text-slate-400 text-xs mt-0.5">ملفات وأوراق عمل أعدها الأستاذ لطلبته</p>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              {teacherMaterials.length} ملف متوفر
            </span>
          </div>

          {teacherMaterials.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-bold text-sm">لا توجد دوسيات منشورة حالياً لهذا المعلم</p>
              <p className="text-slate-400 text-xs mt-1">تواصل مع الأستاذ مباشرة عبر واتساب لطلب أحدث أوراق العمل والتلخيصات.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teacherMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                        {mat.grade}
                      </span>
                      {mat.downloads > 0 && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Download size={12} /> {mat.downloads}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-navy-900 text-base mb-2 line-clamp-2">
                      {mat.title}
                    </h3>
                  </div>

                  <a
                    href={mat.googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-cyan-accent hover:text-white text-slate-700 font-bold text-xs transition-colors"
                  >
                    <Download size={14} />
                    <span>تحميل عبر Google Drive</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Back to Directory CTA ── */}
        <div className="text-center pt-6">
          <Link
            href="/grades"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-md transition-all hover:scale-105"
          >
            <span>استعراض كافة صفوف مدرسة القدومي</span>
            <ArrowRight size={16} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
