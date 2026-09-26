'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GRADES_CONFIG,
  STAGES,
  StageId,
  GradeConfig,
  isTeacherInGrade,
  isMaterialInGrade,
} from '@/lib/grades';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  Search,
  ArrowLeft,
  ChevronLeft,
  X,
  Award,
  BookMarked,
  Sparkles,
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

// Stage-specific glassmorphic design configurations
const STAGE_THEMES: Record<
  StageId,
  {
    badgeClass: string;
    dotClass: string;
    cardBorder: string;
    topHighlight: string;
    cornerGlow: string;
    hoverShadow: string;
    numeralDefault: string;
    actionTextColor: string;
    actionButtonHover: string;
  }
> = {
  primary: {
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    cardBorder: 'border-emerald-500/20 hover:border-emerald-400/50',
    topHighlight: 'via-emerald-400/60',
    cornerGlow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    hoverShadow: 'hover:shadow-emerald-500/10',
    numeralDefault: 'from-emerald-500 to-teal-600',
    actionTextColor: 'text-emerald-400 group-hover:text-emerald-300',
    actionButtonHover: 'group-hover:bg-emerald-500 group-hover:text-slate-950',
  },
  middle: {
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    dotClass: 'bg-indigo-400',
    cardBorder: 'border-indigo-500/20 hover:border-indigo-400/50',
    topHighlight: 'via-indigo-400/60',
    cornerGlow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
    hoverShadow: 'hover:shadow-indigo-500/10',
    numeralDefault: 'from-indigo-500 to-blue-600',
    actionTextColor: 'text-indigo-400 group-hover:text-indigo-300',
    actionButtonHover: 'group-hover:bg-indigo-500 group-hover:text-slate-950',
  },
  secondary: {
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400',
    cardBorder: 'border-amber-500/25 hover:border-amber-400/60',
    topHighlight: 'via-amber-400/70',
    cornerGlow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    hoverShadow: 'hover:shadow-amber-500/15',
    numeralDefault: 'from-amber-500 via-orange-500 to-amber-600',
    actionTextColor: 'text-amber-400 group-hover:text-amber-300',
    actionButtonHover: 'group-hover:bg-amber-500 group-hover:text-slate-950',
  },
};

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
    <div className="min-h-screen bg-gradient-to-b from-[#051124] via-[#071938] to-[#0A2246] text-white font-arabic transition-colors selection:bg-cyan-500/30 selection:text-cyan-200">
      <title>دليل الصفوف المدرسية والمناهج | مركز القدومي الثقافي</title>
      <meta
        name="description"
        content="تصفح جميع المراحل والصفوف الدراسية في مركز القدومي الثقافي من الصف الأول الأساسي حتى التوجيهي الأكاديمي والمهني BTEC مع نخبة المعلمين والدوسيات الحصرية."
      />

      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden text-white">
        {/* Glow & Backdrop Ornaments */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 mb-6"
          >
            <Link href="/" className="hover:text-cyan-300 transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-cyan-300 font-bold">الصفوف الدراسية والمناهج</span>
          </nav>

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/15 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                البرامج والمناهج التعليمية المعتمدة
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              اختر صفك الدراسي من <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300">
                برامج مركز القدومي
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              بوابة متكاملة تضم 13 صفاً دراسياً عبر 3 مراحل تعليمية. استكشف المواد المعتمدة،
              حمّل الدوسيات وأوراق العمل، وتعرّف على نخبة معلّمي المركز لكل صف.
            </p>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-12">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-center hover:border-white/20 transition-all shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 mb-1">١٣</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">صفاً دراسياً شاملاً</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-center hover:border-white/20 transition-all shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">٣</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">مراحل تعليمية متخصصة</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-center hover:border-white/20 transition-all shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">+٩٠</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">مادة ومنهاج دراسي</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-center hover:border-white/20 transition-all shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-1">١٠٠٪</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">تغطية وزارية معتمدة</div>
            </div>
          </div>

          {/* Search & Quick Jump Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن صف، مادة، أو مرحلة دراسية (مثال: عاشر، أول ثانوي، توجيهي، رياضيات)..."
                className="w-full pr-12 pl-12 py-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl text-white placeholder-slate-400 text-sm sm:text-base border border-white/15 shadow-2xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Stage Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setSelectedStage('all')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  selectedStage === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border-cyan-400/40'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border-white/10'
                }`}
              >
                جميع المراحل (١٣)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStage('primary')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                  selectedStage === 'primary'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-400/40'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                الصفوف الأساسية (٤)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStage('middle')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                  selectedStage === 'middle'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border-indigo-400/40'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                الصفوف العليا (٦)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStage('secondary')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                  selectedStage === 'secondary'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 border-amber-400/40'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                المرحلة الثانوية والتوجيهي (٣)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MAIN DIRECTORY CONTENT */}
      {/* ============================================================ */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {filteredGrades.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/[0.05] border-0 flex items-center justify-center text-slate-600">
              <Search className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-2">لم نتمكن من العثور على أي صف</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              لم نعثر على نتائج تطابق &quot;{searchQuery}&quot;. جرب البحث بكلمات أخرى كاسم الصف أو المنهاج أو المادة.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStage('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
            >
              إعادة ضبط الفلترة
            </button>
          </div>
        ) : (
          /* Stages Render */
          <div className="space-y-20">
            {stagesData.map(({ stageId, config, grades }) => {
              if (grades.length === 0) return null;
              const theme = STAGE_THEMES[stageId];

              return (
                <section key={stageId} id={stageId} className="relative scroll-mt-28">
                  {/* Stage Category Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold mb-2.5 border shadow-sm backdrop-blur-md bg-white/[0.06] border-white/15">
                        <span className={`w-2 h-2 rounded-full ${theme.dotClass} animate-pulse`} />
                        <span className="text-navy-900">{config.badge}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight flex items-center gap-3">
                        <span>{config.name}</span>
                        <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-700 border border-slate-200">
                          {grades.length} صفوف
                        </span>
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                        {config.description}
                      </p>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-slate-600 bg-white/[0.05] border border-slate-200 px-3.5 py-1.5 rounded-xl self-start md:self-auto">
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
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="h-full"
                        >
                          <Link
                            href={`/grades/${grade.slug}`}
                            className={`group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl bg-slate-900/60 backdrop-blur-xl border ${theme.cardBorder} hover:shadow-2xl ${theme.hoverShadow} transition-all duration-300 overflow-hidden`}
                          >
                            {/* Ambient Corner Glow */}
                            <div
                              className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${theme.cornerGlow}`}
                            />

                            {/* Top Highlight Accent Line */}
                            <div
                              className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.topHighlight} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`}
                            />

                            {/* Card Content Top */}
                            <div>
                              {/* Header Row: Numeral & Badge */}
                              <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg bg-gradient-to-br ${
                                      grade.gradient || theme.numeralDefault
                                    } text-navy-900 shrink-0 border border-white/20 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300`}
                                  >
                                    {grade.numeral}
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-500 block tracking-wide">
                                      {grade.stageName}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-600">
                                      {grade.shortName}
                                    </span>
                                  </div>
                                </div>

                                <span
                                  className={`text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur border shrink-0 ${theme.badgeClass}`}
                                >
                                  {grade.badgeText}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-xl font-black text-navy-900 group-hover:text-cyan-300 transition-colors leading-tight mb-2">
                                {grade.name}
                              </h3>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-600/90 leading-relaxed mb-5 line-clamp-2">
                                {grade.description}
                              </p>

                              {/* Subjects Preview Pills */}
                              <div className="mb-6">
                                <div className="text-[11px] font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>المواد والمنهاج:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {grade.subjects.slice(0, 3).map((sub) => (
                                    <span
                                      key={sub.id}
                                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-slate-200 text-slate-700 transition-colors"
                                    >
                                      {sub.name}
                                    </span>
                                  ))}
                                  {grade.subjects.length > 3 && (
                                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                                      +{grade.subjects.length - 3} مواد
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Bottom */}
                            <div className="pt-4 border-t border-white/[0.08] mt-2">
                              {/* Stats Row with High Contrast */}
                              <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <BookMarked className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span className="truncate">
                                    <strong className="text-navy-900 font-bold">{grade.subjects.length}</strong> مواد
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="truncate">
                                    <strong className="text-navy-900 font-bold">
                                      {loadingStats ? '...' : stats.teachersCount > 0 ? stats.teachersCount : 'كادر'}
                                    </strong>{' '}
                                    {stats.teachersCount > 0 ? 'معلمين' : 'متخصص'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="truncate">
                                    <strong className="text-navy-900 font-bold">
                                      {loadingStats ? '...' : stats.materialsCount > 0 ? stats.materialsCount : 'ملفات'}
                                    </strong>{' '}
                                    {stats.materialsCount > 0 ? 'دوسيات' : 'معتمدة'}
                                  </span>
                                </div>
                              </div>

                              {/* Action Row */}
                              <div className="flex items-center justify-between pt-1">
                                <span
                                  className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${theme.actionTextColor}`}
                                >
                                  <span>استكشف الصف والدوسيات</span>
                                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                                </span>
                                <div
                                  className={`w-8 h-8 rounded-xl bg-white/[0.06] border border-slate-200 flex items-center justify-center text-slate-600 ${theme.actionButtonHover} group-hover:border-transparent transition-all duration-300 shadow-sm`}
                                >
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
        <section className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#071938]/90 to-indigo-950/90 text-navy-900 relative overflow-hidden shadow-2xl border border-white/15 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>إرشاد أكاديمي متخصص</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-3 text-navy-900">
                هل تحتاج إلى استشارة لتحديد مسار التوجيهي أو BTEC؟
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                يقدم مستشارونا الأكاديميون جلسات توجيه مخصصة للطلبة وأولياء الأمور لاختيار
                الفرع الأنسب وضمان تحقيق أعلى معدل قبول جامعي.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold text-sm text-center shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
              >
                تواصل مع المرشد الأكاديمي
              </Link>
              <Link
                href="/teachers"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-navy-900 font-semibold text-sm text-center backdrop-blur border border-white/15 transition-all"
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
