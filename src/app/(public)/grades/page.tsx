'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GRADES_CONFIG,
  STAGES,
  StageId,
  GradeConfig,
  isTeacherInGrade,
  isMaterialInGrade,
} from '@/lib/grades';
import DynamicLogo from '@/components/DynamicLogo';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  Search,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  X,
  Layers,
  Award,
  BookMarked,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface TeacherItem {
  id: number;
  name: string;
  subject: string;
  grades: string;
  image?: string | null;
}

interface MaterialItem {
  id: number;
  title: string;
  subject: string;
  grade: string;
  teacherName: string;
}

export default function GradesDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<'all' | StageId>('all');
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load teachers and materials dynamically for accurate real-time stats
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [teachersRes, materialsRes] = await Promise.all([
          fetch('/api/teachers').catch(() => null),
          fetch('/api/materials').catch(() => null),
        ]);

        if (teachersRes && teachersRes.ok) {
          const tData = await teachersRes.json();
          if (isMounted && Array.isArray(tData)) setTeachers(tData);
        }
        if (materialsRes && materialsRes.ok) {
          const mData = await materialsRes.json();
          if (isMounted && Array.isArray(mData)) setMaterials(mData);
        }
      } catch (err) {
        console.warn('Could not load dynamic counts for grades directory:', err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute stats per grade
  const gradeStats = useMemo(() => {
    const stats: Record<string, { teachersCount: number; materialsCount: number }> = {};
    for (const grade of GRADES_CONFIG) {
      const teachersCount = teachers.filter((t) => isTeacherInGrade(t.grades, grade.slug)).length;
      const materialsCount = materials.filter((m) => isMaterialInGrade(m.grade, grade.slug)).length;
      stats[grade.slug] = { teachersCount, materialsCount };
    }
    return stats;
  }, [teachers, materials]);

  // Filtered grades based on search and stage
  const filteredGrades = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return GRADES_CONFIG.filter((grade) => {
      const matchesStage = selectedStage === 'all' || grade.stage === selectedStage;
      if (!matchesStage) return false;
      if (!query) return true;

      const inName = grade.name.toLowerCase().includes(query);
      const inShort = grade.shortName.toLowerCase().includes(query);
      const inSlug = grade.slug.toLowerCase().includes(query);
      const inNumeral = grade.numeral.toLowerCase().includes(query);
      const inAliases = grade.aliases.some((a) => a.toLowerCase().includes(query));
      const inSubjects = grade.subjects.some((s) => s.name.toLowerCase().includes(query));
      const inDesc = grade.description.toLowerCase().includes(query);

      return inName || inShort || inSlug || inNumeral || inAliases || inSubjects || inDesc;
    });
  }, [searchQuery, selectedStage]);

  // Partition filtered grades into stages
  const primaryGrades = useMemo(() => filteredGrades.filter((g) => g.stage === 'primary'), [filteredGrades]);
  const middleGrades = useMemo(() => filteredGrades.filter((g) => g.stage === 'middle'), [filteredGrades]);
  const secondaryGrades = useMemo(() => filteredGrades.filter((g) => g.stage === 'secondary'), [filteredGrades]);

  const stagesData: Array<{
    stageId: StageId;
    config: (typeof STAGES)[StageId];
    grades: GradeConfig[];
  }> = [
    { stageId: 'primary', config: STAGES.primary, grades: primaryGrades },
    { stageId: 'middle', config: STAGES.middle, grades: middleGrades },
    { stageId: 'secondary', config: STAGES.secondary, grades: secondaryGrades },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] text-white transition-colors">
      <title>دليل الصفوف المدرسية والمناهج | مركز القدومي الثقافي</title>
      <meta
        name="description"
        content="تصفح جميع المراحل والصفوف الدراسية في مركز القدومي الثقافي من الصف الأول الأساسي حتى التوجيهي الأكاديمي والمهني BTEC مع نخبة المعلمين والدوسيات الحصرية."
      />

      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden text-white">
        {/* Glow & Backdrop Ornaments */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300/80 mb-6"
          >
            <Link href="/" className="hover:text-cyan-accent transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
            <span className="text-cyan-accent font-medium">الصفوف الدراسية والمناهج</span>
          </nav>

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-navy-900/40/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold text-white tracking-wide">البرامج التعليمية الشاملة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              اختر صفك الدراسي من <br className="hidden sm:block" />
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">
                برامج المركز
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200/85 leading-relaxed max-w-2xl mx-auto">
              بوابة متكاملة تضم 13 صفاً دراسياً عبر 3 مراحل تعليمية. استكشف المواد المعتمدة،
              حمّل الدوسيات وأوراق العمل، وتعرّف على نخبة معلّمي مركز القدومي الثقافي لكل صف.
            </p>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-12">
            <div className="p-4 rounded-2xl bg-navy-900/40/5 backdrop-blur border border-white/10 text-center hover:bg-navy-900/40/10 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-cyan-accent mb-1">١٣</div>
              <div className="text-xs sm:text-sm text-slate-300">صفاً دراسياً شاملاً</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/40/5 backdrop-blur border border-white/10 text-center hover:bg-navy-900/40/10 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">٣</div>
              <div className="text-xs sm:text-sm text-slate-300">مراحل تعليمية متخصصة</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/40/5 backdrop-blur border border-white/10 text-center hover:bg-navy-900/40/10 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">+٩٠</div>
              <div className="text-xs sm:text-sm text-slate-300">مادة ومنهاج دراسي</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/40/5 backdrop-blur border border-white/10 text-center hover:bg-navy-900/40/10 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-1">١٠٠٪</div>
              <div className="text-xs sm:text-sm text-slate-300">تغطية وزارية ومعتمدة</div>
            </div>
          </div>

          {/* Search & Quick Jump Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن صف، مادة، أو مرحلة دراسية (مثال: عاشر، أول ثانوي، توجيهي، رياضيات)..."
                className="w-full pr-12 pl-12 py-4 rounded-2xl bg-navy-900/40/5 text-white placeholder-slate-400 text-sm sm:text-base border border-white/10 shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Stage Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setSelectedStage('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedStage === 'all'
                    ? 'bg-cyan-accent text-navy shadow-lg shadow-cyan-accent/25'
                    : 'bg-navy-900/40/10 text-slate-200 hover:bg-navy-900/40/20'
                }`}
              >
                جميع المراحل (١٣)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStage('primary')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  selectedStage === 'primary'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-navy-900/40/10 text-slate-200 hover:bg-navy-900/40/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                الصفوف الأساسية (٤)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStage('middle')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  selectedStage === 'middle'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'bg-navy-900/40/10 text-slate-200 hover:bg-navy-900/40/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                الصفوف العليا (٦)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStage('secondary')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  selectedStage === 'secondary'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-navy-900/40/10 text-slate-200 hover:bg-navy-900/40/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                المرحلة الثانوية (٣)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MAIN DIRECTORY CONTENT */}
      {/* ============================================================ */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {filteredGrades.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 bg-navy-900/40 flex items-center justify-center text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">لم نتمكن من العثور على أي صف</h3>
            <p className="text-slate-300 text-slate-400 text-sm mb-6">
              لم نعثر على نتائج تطابق &quot;{searchQuery}&quot;. جرب البحث بكلمات أخرى كاسم الصف أو المادة.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStage('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-navy dark:bg-cyan-accent text-white dark:text-navy font-semibold text-sm hover:opacity-95 transition-opacity"
            >
              إعادة ضبط الفلترة
            </button>
          </div>
        ) : (
          /* Stages Render */
          <div className="space-y-20">
            {stagesData.map(({ stageId, config, grades }) => {
              if (grades.length === 0) return null;

              return (
                <section key={stageId} id={stageId} className="relative scroll-mt-28">
                  {/* Stage Category Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10 border-white/10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 border shadow-sm backdrop-blur">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.accentColor }}
                        />
                        <span>{config.badge}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                        <span>{config.name}</span>
                        <span className="text-sm sm:text-base font-normal text-slate-300 text-slate-400">
                          ({grades.length} صفوف)
                        </span>
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300 text-slate-400 mt-1 max-w-2xl">
                        {config.description}
                      </p>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      {config.subtitle}
                    </div>
                  </div>

                  {/* Grades Cards Grid */}
                  <div
                    className={`grid gap-6 ${
                      stageId === 'primary'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        : stageId === 'middle'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                  >
                    {grades.map((grade) => {
                      const stats = gradeStats[grade.slug] || {
                        teachersCount: 0,
                        materialsCount: 0,
                      };

                      return (
                        <motion.div
                          key={grade.slug}
                          whileHover={{ y: -8, scale: 1.02 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="h-full"
                        >
                          <Link
                            href={`/grades/${grade.slug}`}
                            className={`group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${grade.cardBg} ${grade.borderAccent}`}
                          >
                            {/* Stylized Eastern Arabic Numeral Watermark */}
                            <span
                              aria-hidden="true"
                              className="absolute -top-3 -left-3 font-black text-7xl sm:text-8xl select-none pointer-events-none opacity-[0.08] dark:opacity-[0.12] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-1"
                            >
                              {grade.numeral}
                            </span>

                            {/* Top Card Header */}
                            <div>
                              <div className="flex items-center justify-between gap-3 mb-4">
                                {/* Stylized Highlight Numeral Badge */}
                                <div
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-md bg-gradient-to-br ${grade.gradient} text-white shrink-0 group-hover:rotate-3 transition-transform`}
                                >
                                  {grade.numeral}
                                </div>

                                {/* Floating Stage Tag */}
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-navy-900/40/80 bg-navy-900/40/80 backdrop-blur border border-white/10 dark:border-slate-700 text-slate-700 text-slate-300 shadow-sm">
                                  {grade.badgeText}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg sm:text-xl font-black mb-2 text-white text-white group-hover:text-primary-600 dark:group-hover:text-cyan-accent transition-colors">
                                {grade.name}
                              </h3>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-300 text-slate-300 line-clamp-2 leading-relaxed mb-5">
                                {grade.description}
                              </p>

                              {/* Curricula Subjects Preview Pills */}
                              <div className="mb-6">
                                <div className="text-[11px] font-semibold text-slate-300 text-slate-400 mb-2 flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                  <span>أبرز المواد المقررة:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {grade.subjects.slice(0, 3).map((sub) => (
                                    <span
                                      key={sub.id}
                                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-navy-900/40/70 bg-navy-900/40/70 border border-white/10/60 dark:border-slate-700 text-slate-700 text-slate-300"
                                    >
                                      {sub.name}
                                    </span>
                                  ))}
                                  {grade.subjects.length > 3 && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 text-slate-400">
                                      +{grade.subjects.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Bottom Card Footer */}
                            <div className="pt-4 border-t border-white/10/80 border-white/10/80">
                              {/* Stats Pills */}
                              <div className="flex items-center justify-between text-xs text-slate-300 text-slate-400 mb-4">
                                <span className="inline-flex items-center gap-1">
                                  <BookMarked className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{grade.subjects.length} مواد</span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-slate-400" />
                                  <span>
                                    {loadingStats
                                      ? '...'
                                      : stats.teachersCount > 0
                                      ? `${stats.teachersCount} أساتذة`
                                      : 'كادر متخصص'}
                                  </span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                                  <span>
                                    {loadingStats
                                      ? '...'
                                      : stats.materialsCount > 0
                                      ? `${stats.materialsCount} دوسيات`
                                      : 'دوسيات معتمدة'}
                                  </span>
                                </span>
                              </div>

                              {/* Action Link Row */}
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-cyan-accent transition-colors flex items-center gap-1">
                                  <span>استكشف الصف والمحتوى</span>
                                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                </span>
                                <div className="w-8 h-8 rounded-full bg-navy-900/40 bg-navy-900/40 flex items-center justify-center text-slate-400 group-hover:bg-navy group-hover:text-white dark:group-hover:bg-cyan-accent dark:group-hover:text-navy transition-all shadow-sm">
                                  <ChevronLeft className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. CALL TO ACTION: ACADEMIC ADVISING BANNER */}
        {/* ============================================================ */}
        <section className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-950 text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900/40/10 text-gold text-xs font-bold mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>إرشاد أكاديمي متخصص</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-3">
                هل تحتاج إلى استشارة لتحديد مسار التوجيهي أو BTEC؟
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                يقدم مستشارونا الأكاديميون جلسات توجيه مخصصة للطلبة وأولياء الأمور لاختيار
                الفرع الأنسب وضمان تحقيق أعلى معدل قبول جامعي.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold text-navy-950 font-bold text-sm text-center shadow-lg hover:bg-gold/90 transition-colors"
              >
                تواصل مع المرشد الأكاديمي
              </Link>
              <Link
                href="/teachers"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900/40/10 hover:bg-navy-900/40/20 text-white font-semibold text-sm text-center backdrop-blur border border-white/15 transition-colors"
              >
                تصفح كادر المعلمين
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
