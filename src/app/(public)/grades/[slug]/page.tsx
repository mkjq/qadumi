import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getGradeBySlug, isTeacherInGrade, isMaterialInGrade, STAGES } from '@/lib/grades';
import { BookOpen, FileText, Users, Download, Phone, MessageCircle, ChevronLeft, ArrowRight, Star } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface GradePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GradePageProps): Promise<Metadata> {
  const grade = getGradeBySlug(params.slug);
  if (!grade) return { title: '???? ??? ????? | ???? ???????' };

  return {
    title: `${grade.name} | ???? ??????? ???????`,
    description: `?????? ????? ??????? ????? ????? ${grade.name} ?? ???? ??????? ???????.`,
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
    <div className="min-h-screen bg-slate-50 font-arabic pb-24" dir="rtl">
      {/* -- 1. Hero Header & Breadcrumb -- */}
      <section className="relative bg-gradient-to-b from-[#051124] via-[#071938] to-[#0A2246] text-white pt-24 sm:pt-28 pb-16 px-4 overflow-hidden border-b border-white/10">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-6">
            <Link href="/" className="hover:text-white transition-colors">????????</Link>
            <ChevronLeft size={14} className="text-slate-400" />
            <Link href="/grades" className="hover:text-white transition-colors">?????? ????????</Link>
            <ChevronLeft size={14} className="text-slate-400" />
            <span className="text-cyan-300 font-bold">{grade.name}</span>
          </nav>

          {/* Grade Title Badge & Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 text-xs sm:text-sm font-bold mb-3 backdrop-blur-md border border-white/15">
                <Star size={14} className="text-amber-400" />
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
            <div className="flex items-center gap-3 bg-white/[0.06] border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl self-start sm:self-auto shadow-lg">
              <div className="text-center px-4 border-l border-white/10">
                <div className="text-2xl font-black text-cyan-300">{grade.subjects.length}</div>
                <div className="text-xs font-semibold text-slate-300">???? ??????</div>
              </div>
              <div className="text-center px-4 border-l border-white/10">
                <div className="text-2xl font-black text-amber-300">{materials.length}</div>
                <div className="text-xs font-semibold text-slate-300">????? ????</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-black text-emerald-300">{teachers.length}</div>
                <div className="text-xs font-semibold text-slate-300">???? ?????</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. Quick Navigation Tabs Anchor -- */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center sm:justify-start gap-4 sm:gap-8 py-3 text-sm font-bold">
          <a href="#subjects" className="flex items-center gap-2 text-slate-700 hover:text-cyan-700 transition-colors">
            <BookOpen size={16} className="text-cyan-700" />
            <span>?????? ???????</span>
            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full font-bold">{grade.subjects.length}</span>
          </a>
          <a href="#materials" className="flex items-center gap-2 text-slate-700 hover:text-cyan-700 transition-colors">
            <FileText size={16} className="text-amber-600" />
            <span>???????? ?????????</span>
            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full font-bold">{materials.length}</span>
          </a>
          <a href="#teachers" className="flex items-center gap-2 text-slate-700 hover:text-cyan-700 transition-colors">
            <Users size={16} className="text-emerald-600" />
            <span>???? ????????</span>
            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full font-bold">{teachers.length}</span>
          </a>
        </div>
      </div>

      {/* -- 3. Main Content Container -- */}
      <div className="max-w-6xl mx-auto px-4 pt-12 space-y-20">
        
        {/* -- Section A: Subjects Grid -- */}
        <section id="subjects" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <span className="text-cyan-700 text-xs font-extrabold uppercase tracking-wider block mb-1">??????? ????????</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900">?????? ???????? ???????</h2>
            </div>
            <span className="text-slate-500 font-medium text-xs sm:text-sm bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {grade.subjects.length} ???? ??????
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {grade.subjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center font-black text-lg group-hover:scale-105 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <BookOpen size={22} />
                    </div>
                    {sub.branch && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {sub.branch}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-navy-900 mb-2 group-hover:text-cyan-700 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {sub.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700 group-hover:text-cyan-800">
                  <span>?????? ????????? ??????</span>
                  <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -- Section B: Dousies & Materials -- */}
        <section id="materials" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <span className="text-amber-700 text-xs font-extrabold uppercase tracking-wider block mb-1">??? ???????</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900">???????? ?????? ?????</h2>
            </div>
            <Link href="/materials" className="text-xs sm:text-sm text-cyan-700 hover:text-cyan-900 hover:underline font-bold flex items-center gap-1">
              <span>??? ?? ????????</span>
              <ArrowRight size={14} className="rotate-180" />
            </Link>
          </div>

          {materials.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 shadow-sm">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold mb-1">?? ???? ?????? ?????? ???? ???? ??????</p>
              <p className="text-slate-500 text-xs">???? ???? ?????? ?????? ?????? ???? ???????? ????????.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        {mat.subject}
                      </span>
                      {mat.downloads > 0 && (
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Download size={12} /> {mat.downloads} ?????
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-navy-900 text-base mb-1.5 line-clamp-2">
                      {mat.title}
                    </h3>
                    <p className="text-slate-600 text-xs mb-4">
                      ?????: <span className="font-bold text-slate-800">{mat.teacherName}</span>
                    </p>
                  </div>

                  <a
                    href={mat.googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <Download size={14} />
                    <span>????? ??????? (Google Drive)</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* -- Section C: Teachers Roster for this Grade -- */}
        <section id="teachers" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <span className="text-emerald-700 text-xs font-extrabold uppercase tracking-wider block mb-1">???? ????????</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900">????? {grade.name}</h2>
            </div>
            <span className="text-slate-500 font-medium text-xs sm:text-sm bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {teachers.length} ??????
            </span>
          </div>

          {teachers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 shadow-sm">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold mb-1">??? ????? ????? ???????? ???????? ???? ???? ??????</p>
              <Link href="/contact" className="text-xs text-cyan-700 font-bold hover:underline">
                ????? ?? ??????? ????????? ?? ???????? ????????
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Teacher Card Header with Image Link */}
                  <Link href={`/teachers/${teacher.id}`} className="block p-5 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-slate-200 group-hover:border-cyan-500 transition-colors">
                        {teacher.image ? (
                          <Image
                            src={teacher.image}
                            alt={teacher.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-cyan-50 text-cyan-700 font-black text-xl">
                            {teacher.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold mb-1">
                          {teacher.subject}
                        </span>
                        <h3 className="font-black text-lg text-navy-900 group-hover:text-cyan-700 transition-colors">
                          {teacher.name}
                        </h3>
                      </div>
                    </div>

                    {teacher.bio && (
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
                        {teacher.bio}
                      </p>
                    )}

                    <div className="text-xs font-bold text-cyan-700 flex items-center gap-1 group-hover:text-cyan-800 group-hover:underline">
                      <span>??? ????? ?????? ???????</span>
                      <ArrowRight size={12} className="rotate-180" />
                    </div>
                  </Link>

                  {/* Quick Contact Bar */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    {teacher.whatsapp && (
                      <a
                        href={whatsappLink(teacher.whatsapp, `?????? ????? ${teacher.name}? ??? ????????? ?? ??? ${grade.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        <MessageCircle size={14} />
                        <span>??????</span>
                      </a>
                    )}
                    {teacher.phone && (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition-colors"
                        title="????? ?????"
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
