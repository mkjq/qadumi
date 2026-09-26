import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getGradeBySlug, getAllGradeSlugs, isTeacherInGrade, isMaterialInGrade, STAGES } from '@/lib/grades';
import { BookOpen, FileText, Users, Download, ExternalLink, Phone, MessageCircle, ChevronLeft, ArrowRight, Star, GraduationCap, CheckCircle2 } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface GradePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GradePageProps): Promise<Metadata> {
  const grade = getGradeBySlug(params.slug);
  if (!grade) return { title: 'الصف غير موجود | مركز القدومي' };

  return {
    title: `${grade.name} | مركز القدومي الثقافي`,
    description: `شروحات ومواد ودوسيات وكادر معلمي ${grade.name} في مركز القدومي الثقافي.`,
  };
}

export default async function GradeDetailPage({ params }: GradePageProps) {
  const grade = getGradeBySlug(params.slug);
  if (!grade) {
    notFound();
  }

  const stage = STAGES[grade.stage];

  // Fetch all active teachers and materials from database
  const [allTeachers, allMaterials] = await Promise.all([
    prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.material.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Filter teachers & materials relevant to this grade
  const teachers = allTeachers.filter((t) => isTeacherInGrade(t.grades, grade.slug));
  const materials = allMaterials.filter((m) => isMaterialInGrade(m.grade, grade.slug));

  return (
    <div className="min-h-screen bg-slate-50/60 font-arabic pb-24" dir="rtl">
      {/* ── 1. Hero Header & Breadcrumb ── */}
      <section className="relative bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-24 sm:pt-28 pb-16 px-4 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} className="text-slate-500" />
            <Link href="/grades" className="hover:text-white transition-colors">الصفوف الدراسية</Link>
            <ChevronLeft size={14} className="text-slate-500" />
            <span className="text-cyan-accent font-semibold">{grade.name}</span>
          </nav>

          {/* Grade Title Badge & Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-accent text-xs sm:text-sm font-bold mb-3 backdrop-blur-sm border border-white/10">
                <Star size={14} />
                <span>{stage.name}</span>
                <span className="text-white/40">•</span>
                <span>{grade.badgeText}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
                {grade.name}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {grade.description}
              </p>
            </div>

            {/* Quick Stats Capsule */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-md self-start sm:self-auto">
              <div className="text-center px-3 border-l border-white/10">
                <div className="text-2xl font-black text-cyan-accent">{grade.subjects.length}</div>
                <div className="text-[11px] text-slate-400">مواد دراسية</div>
              </div>
              <div className="text-center px-3 border-l border-white/10">
                <div className="text-2xl font-black text-amber-400">{materials.length}</div>
                <div className="text-[11px] text-slate-400">دوسية وملف</div>
              </div>
              <div className="text-center px-3">
                <div className="text-2xl font-black text-emerald-400">{teachers.length}</div>
                <div className="text-[11px] text-slate-400">معلم متخصص</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Quick Navigation Tabs Anchor ── */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center sm:justify-start gap-4 sm:gap-8 py-3 text-sm font-bold">
          <a href="#subjects" className="flex items-center gap-1.5 text-slate-600 hover:text-cyan-accent transition-colors">
            <BookOpen size={16} />
            <span>المواد المقررة</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{grade.subjects.length}</span>
          </a>
          <a href="#materials" className="flex items-center gap-1.5 text-slate-600 hover:text-cyan-accent transition-colors">
            <FileText size={16} />
            <span>الدوسيات والملخصات</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{materials.length}</span>
          </a>
          <a href="#teachers" className="flex items-center gap-1.5 text-slate-600 hover:text-cyan-accent transition-colors">
            <Users size={16} />
            <span>كادر المعلمين</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{teachers.length}</span>
          </a>
        </div>
      </div>

      {/* ── 3. Main Content Container ── */}
      <div className="max-w-6xl mx-auto px-4 pt-12 space-y-20">
        
        {/* ── Section A: Subjects Grid ── */}
        <section id="subjects" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-cyan-accent text-xs font-bold uppercase tracking-wider">المنهاج التعليمي</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">المواد الدراسية المقررة</h2>
            </div>
            <span className="text-slate-400 text-xs sm:text-sm">{grade.subjects.length} مادة معتمدة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {grade.subjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-accent-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-accent-50 text-cyan-accent-600 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                    <BookOpen size={22} />
                  </div>
                  {sub.branch && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                      {sub.branch}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-navy-900 mb-2 group-hover:text-cyan-accent transition-colors">
                  {sub.name}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                  {sub.description}
                </p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-accent">
                  <span>شروحات واختبارات</span>
                  <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section B: Dousies & Materials ── */}
        <section id="materials" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">بنك الملفات</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">الدوسيات وأوراق العمل</h2>
            </div>
            <Link href="/materials" className="text-xs sm:text-sm text-cyan-accent hover:underline font-bold">
              عرض كل الدوسيات &larr;
            </Link>
          </div>

          {materials.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold mb-1">لا توجد دوسيات مرفوعة لهذا الصف حالياً</p>
              <p className="text-slate-400 text-xs">يقوم كادر المركز بتجهيز وتحديث أحدث الملخصات باستمرار.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                        {mat.subject}
                      </span>
                      {mat.downloads > 0 && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Download size={12} /> {mat.downloads} تحميل
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-navy-900 text-base mb-1.5 line-clamp-2">
                      {mat.title}
                    </h3>
                    <p className="text-slate-500 text-xs mb-4">
                      إعداد: <span className="font-semibold text-slate-700">{mat.teacherName}</span>
                    </p>
                  </div>

                  <a
                    href={mat.googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-cyan-accent hover:text-white text-slate-700 font-bold text-xs transition-colors"
                  >
                    <Download size={14} />
                    <span>تحميل الدوسية (Google Drive)</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Section C: Teachers Roster for this Grade ── */}
        <section id="teachers" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">نخبة الأساتذة</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">معلمو {grade.name}</h2>
            </div>
            <span className="text-slate-400 text-xs sm:text-sm">{teachers.length} معلمين</span>
          </div>

          {teachers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold mb-1">يتم تحديث أسماء الأساتذة المتاحين لهذا الصف قريباً</p>
              <Link href="/contact" className="text-xs text-cyan-accent font-bold hover:underline">
                تواصل مع الإدارة للاستفسار عن المعلمين المتاحين
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-accent-300 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Teacher Card Header with Image Link */}
                  <Link href={`/teachers/${teacher.id}`} className="block p-5 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-slate-100 group-hover:border-cyan-accent transition-colors">
                        {teacher.image ? (
                          <Image
                            src={teacher.image}
                            alt={teacher.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-cyan-accent-50 text-cyan-accent font-black text-xl">
                            {teacher.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-accent-50 text-cyan-accent-700 text-[11px] font-bold mb-1">
                          {teacher.subject}
                        </span>
                        <h3 className="font-black text-lg text-navy-900 group-hover:text-cyan-accent transition-colors">
                          {teacher.name}
                        </h3>
                      </div>
                    </div>

                    {teacher.bio && (
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                        {teacher.bio}
                      </p>
                    )}

                    <div className="text-xs font-bold text-cyan-accent flex items-center gap-1 group-hover:underline">
                      <span>عرض الملف الشخصي والصفوف</span>
                      <ArrowRight size={12} className="rotate-180" />
                    </div>
                  </Link>

                  {/* Quick Contact Bar */}
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    {teacher.whatsapp && (
                      <a
                        href={whatsappLink(teacher.whatsapp, `مرحباً أستاذ ${teacher.name}، أود الاستفسار عن حصص ${grade.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
                      >
                        <MessageCircle size={14} />
                        <span>واتساب</span>
                      </a>
                    )}
                    {teacher.phone && (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                        title="اتصال هاتفي"
                      >
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
