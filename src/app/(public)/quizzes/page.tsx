'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, Search, Award, HelpCircle, BookOpen, RefreshCw } from 'lucide-react';
import QuizCard from '@/components/quizzes/QuizCard';
import OrganicBlob from '@/components/ui/OrganicBlob';

interface QuizItem {
  id: number;
  title: string;
  description?: string | null;
  subject: string;
  grade: string;
  durationMinutes: number;
  pointsReward: number;
  pointsPerCorrect: number;
  bonusPoints: number;
  passingScore: number;
  questionCount: number;
}

const subjectsList = [
  'الكل',
  'الرياضيات',
  'الفيزياء',
  'اللغة العربية',
  'الكيمياء',
  'اللغة الإنجليزية',
];

const gradesList = [
  'الكل',
  'توجيهي علمي',
  'توجيهي أدبي',
  'توجيهي (مشترك)',
  'الأول ثانوي',
  'الصفوف العليا',
  'الصفوف الأساسية',
];

export default function QuizzesCatalogPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('الكل');
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadQuizzes() {
      try {
        setLoading(true);
        const res = await fetch('/api/quizzes');
        const data = await res.json();
        if (data && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        }
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSubject =
      selectedSubject === 'الكل' || quiz.subject === selectedSubject;
    const matchesGrade =
      selectedGrade === 'الكل' || quiz.grade === selectedGrade;
    const matchesSearch =
      !searchQuery.trim() ||
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubject && matchesGrade && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] pt-28 pb-20 overflow-hidden font-arabic" dir="rtl">
      {/* Background Animated Blobs */}
      <OrganicBlob variant="cyan" size="2xl" className="-top-32 -right-32 opacity-20" />
      <OrganicBlob variant="electric" size="xl" className="top-1/3 -left-40 opacity-15" />
      <OrganicBlob variant="gold" size="lg" className="bottom-20 right-10 opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-bold text-cyan-400 shadow-sm backdrop-blur-md mb-4">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>منصة الاختبارات التفاعلية والتحفيز الذكي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
            اختبر معلوماتك، <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 bg-clip-text text-transparent">واكسب النقاط والجوائز!</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            اختبارات محوسبة نموذجية بإشراف نخبة كادر مركز القدومي الثقافي. حل الأسئلة، احصل على التقييم الفوري، واجمع النقاط لرفع رتبتك في لوحة الشرف!
          </p>
        </motion.div>

        {/* Filter Controls Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-navy-900/60 p-6 shadow-xl backdrop-blur-xl mb-10"
        >
          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن اختبار بالاسم، الموضوع، أو الوصف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium text-sm sm:text-base"
              />
            </div>

            {/* Subject Filter Pills */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>المادة الدراسية:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjectsList.map((subject) => {
                  const isActive = selectedSubject === subject;
                  return (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade Filter Pills */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>الصف الدراسي:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gradesList.map((grade) => {
                  const isActive = selectedGrade === grade;
                  return (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30 scale-105'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between px-2 mb-6">
          <p className="text-sm font-semibold text-slate-300">
            تم العثور على <span className="font-bold text-cyan-400">{filteredQuizzes.length}</span> اختبار متاح
          </p>
          {(selectedSubject !== 'الكل' || selectedGrade !== 'الكل' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSubject('الكل');
                setSelectedGrade('الكل');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-rose-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-200">جاري تحميل الاختبارات...</p>
          </div>
        ) : filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, idx) => (
              <QuizCard key={quiz.id} quiz={quiz} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center backdrop-blur-sm"
          >
            <HelpCircle className="w-12 h-12 text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">لم يتم العثور على اختبارات مطابقة</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              جرب تغيير معايير البحث أو اختيار مادة أو صف مختلف لعرض الاختبارات المتاحة.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('الكل');
                setSelectedGrade('الكل');
                setSearchQuery('');
              }}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-700"
            >
              عرض جميع الاختبارات
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
