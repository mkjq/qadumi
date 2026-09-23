'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Award, CheckCircle2, Star, ArrowLeft, GraduationCap, Gift, RefreshCw, LogOut, BookOpen, ChevronRight, Flame, User as UserIcon, AlertTriangle, LogIn, Home,  } from 'lucide-react';
import PointsCounter from '@/components/student/PointsCounter';
import LevelProgressBar from '@/components/student/LevelProgressBar';
import RecentLedger, { PointTransactionItem, QuizSubmissionItem } from '@/components/student/RecentLedger';
import EnrolledCoursesSection, { EnrolledGradeItem } from '@/components/student/EnrolledCoursesSection';
import RewardsShowcase from '@/components/student/RewardsShowcase';
import PrestigeRoadmapModal from '@/components/student/PrestigeRoadmapModal';
import DashboardSkeleton from '@/components/student/DashboardSkeleton';
import QuizCard from '@/components/quizzes/QuizCard';
import OrganicBlob from '@/components/ui/OrganicBlob';
import toast from 'react-hot-toast';

interface StudentProfile {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  grade: string;
  points: number;
  level: string;
  avatar?: string | null;
  enrolledGrades?: EnrolledGradeItem[];
  prestige?: {
    level: string;
    minPoints: number;
    maxPoints: number;
    nextLevel: string | null;
    progressPercent: number;
  };
}

interface DashboardStats {
  quizzesCompleted: number;
  averageScore: number;
  totalPointsEarned: number;
}

export default function StudentDashboardClient() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    quizzesCompleted: 0,
    averageScore: 0,
    totalPointsEarned: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<PointTransactionItem[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<QuizSubmissionItem[]>([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  // Load dashboard data with dual-layer auth (cookie + localStorage Bearer token)
  const loadDashboard = useCallback(async (isSilentRefresh = false) => {
    try {
      if (!isSilentRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem('student_token');
        if (localToken) {
          headers['Authorization'] = `Bearer ${localToken}`;
        }
      }

      const res = await fetch('/api/student/dashboard', {
        headers,
        credentials: 'include',
      });

      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('student_token');
          localStorage.removeItem('student_info');
        }
        router.push('/student/login?redirect=/student/dashboard');
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'تعذر تحميل بيانات لوحة التحكم');
      }

      if (data.student) {
        setStudent(data.student);
        setStats(data.stats || { quizzesCompleted: 0, averageScore: 0, totalPointsEarned: 0 });
        setRecentTransactions(data.recentTransactions || []);
        setRecentSubmissions(data.recentSubmissions || []);

        // Sync to localStorage for other components (Header, Navigation)
        if (typeof window !== 'undefined') {
          localStorage.setItem('student_info', JSON.stringify(data.student));
        }

        // Load recommended quizzes matching student grade
        try {
          const gradeParam = encodeURIComponent(data.student.grade || '');
          const quizRes = await fetch(`/api/quizzes?grade=${gradeParam}`);
          if (quizRes.ok) {
            const quizData = await quizRes.json();
            if (Array.isArray(quizData.quizzes) && quizData.quizzes.length > 0) {
              setRecommendedQuizzes(quizData.quizzes.slice(0, 3));
            } else {
              // fallback to all quizzes
              const allRes = await fetch('/api/quizzes');
              if (allRes.ok) {
                const allData = await allRes.json();
                setRecommendedQuizzes((allData.quizzes || []).slice(0, 3));
              }
            }
          }
        } catch (quizErr) {
          console.warn('Could not load recommended quizzes:', quizErr);
        }
      } else {
        throw new Error('لم يتم استرجاع ملف الطالب');
      }
    } catch (err: any) {
      console.error('Failed to load student dashboard:', err);
      setError(err?.message || 'فشل في الاتصال بالخادم');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Window focus synchronization (auto-refresh when switching tabs after quiz)
  useEffect(() => {
    const handleFocus = () => {
      // Silently refresh data on window focus
      loadDashboard(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadDashboard]);

  const handleManualRefresh = async () => {
    await loadDashboard(true);
    toast.success('تم تحديث البيانات والنقاط بنجاح');
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_info');
      }
      await fetch('/api/student/me', { method: 'POST' });
      router.push('/student/login');
    } catch {
      router.push('/student/login');
    }
  };

  // 1. Shimmering Skeleton while initial load
  if (loading) {
    return <DashboardSkeleton />;
  }

  // 2. Resilient Error View if load failed and no student data
  if (error && !student) {
    return (
      <div
        className="relative min-h-screen bg-gradient-to-b from-slate-50 via-rose-50/20 to-white pt-32 pb-20 overflow-hidden flex items-center justify-center px-4"
        dir="rtl"
      >
        <OrganicBlob variant="cyan" size="xl" className="-top-24 -right-24 opacity-20 pointer-events-none" />
        <OrganicBlob variant="gold" size="lg" className="bottom-10 left-10 opacity-20 pointer-events-none" />

        <div className="relative max-w-md w-full rounded-3xl border border-rose-200 bg-white/95 p-8 shadow-xl backdrop-blur-xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-black text-navy-900 mb-2">
            تعذر الاتصال بلوحة تحكم الطالب
          </h2>

          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {error || 'حدث خطأ في استرجاع بياناتك ونقاطك التراكمية. يرجى إعادة المحاولة.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => loadDashboard()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-navy-700 via-navy-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-cyan-600 hover:to-navy-800 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>

            <Link
              href="/student/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-md transition hover:bg-gradient-to-b from-slate-50 to-slate-100"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const studentInitial = student.name ? student.name.trim().charAt(0) : 'ط';

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/20 to-white pt-28 pb-20 overflow-hidden" dir="rtl">
      {/* Organic Background Blobs */}
      <OrganicBlob variant="cyan" size="2xl" className="-top-36 -right-36 opacity-30 pointer-events-none" />
      <OrganicBlob variant="gold" size="xl" className="top-1/3 -left-48 opacity-20 pointer-events-none" />
      <OrganicBlob variant="electric" size="lg" className="bottom-20 right-10 opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Student Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md backdrop-blur-md mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Avatar & Student Name */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-navy-800 via-navy-700 to-cyan-600 text-2xl sm:text-3xl font-black text-white shadow-lg shadow-cyan-500/20 ring-4 ring-white">
                  {studentInitial}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-navy-900 shadow-md ring-2 ring-white">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
                    {student.name}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setRoadmapOpen(true)}
                    className="rounded-full bg-cyan-500/20 border border-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-700 hover:bg-cyan-500/20 transition cursor-pointer flex items-center gap-1"
                    title="انقر لعرض خارطة الرتب"
                  >
                    <span>{student.level}</span>
                    <Star className="w-3 h-3 text-amber-500" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                    {student.grade}
                  </span>
                  {student.phone && (
                    <>
                      <span>•</span>
                      <span>{student.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2.5 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
              {/* Manual Refresh Button */}
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-600 shadow-md transition hover:bg-gradient-to-b from-slate-50 to-slate-100 hover:text-navy-900 active:scale-95 disabled:opacity-50"
                title="تحديث فوري للبيانات والنقاط"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-600' : ''}`} />
                <span className="hidden sm:inline">تحديث</span>
              </button>

              <Link
                href="/quizzes"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-navy-700 to-cyan-700 text-white font-bold px-5 py-3 text-xs sm:text-sm shadow-md transition hover:from-cyan-600 hover:to-navy-800 active:scale-95"
              >
                <Star className="w-4 h-4 text-cyan-300" />
                <span>ابدأ اختبار جديد</span>
              </Link>

            </div>
          </div>
        </motion.div>

        {/* Hero Points Card & Level Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-amber-300/40 bg-gradient-to-br from-white via-amber-50/20 to-gold-500/10 p-6 sm:p-8 shadow-xl shadow-amber-500/5 backdrop-blur-xl mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Points Balance Column */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>رصيدك التراكمي من النقاط</span>
              </span>
              <PointsCounter points={student.points} />
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                كل اختبار تحله بنجاح يضيف نقاطاً جديدة لرصيدك يمكنك استبدالها بخصومات حقيقية وجوائز من مركز القدومي!
              </p>
            </div>

            {/* Level Progression Column */}
            <div className="lg:col-span-7 bg-white/80 rounded-2xl p-6 border border-slate-200 shadow-md">
              <LevelProgressBar
                points={student.points}
                prestige={student.prestige}
                onOpenRoadmap={() => setRoadmapOpen(true)}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid (3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">الاختبارات المكتملة</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-navy-900">{stats.quizzesCompleted}</p>
            <p className="text-xs text-slate-500 mt-1">اختبارات تم تسليمها وتصحيحها</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">معدل الدقة والتحصيل</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-navy-900">{stats.averageScore}%</p>
            <p className="text-xs text-slate-500 mt-1">متوسط علاماتك في جميع الاختبارات</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">إجمالي النقاط المكتسبة</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-navy-900">
              {stats.totalPointsEarned.toLocaleString('ar-EG')}
            </p>
            <p className="text-xs text-slate-500 mt-1">مجموع النقاط التي جمعتها منذ التسجيل</p>
          </motion.div>
        </div>

        {/* Enrolled Courses / Curriculum Subjects Section */}
        <EnrolledCoursesSection
          grade={student.grade}
          enrolledGrades={student.enrolledGrades}
          submissions={recentSubmissions}
        />

        {/* Rewards Showcase Section */}
        <RewardsShowcase
          studentPoints={student.points}
          studentId={student.id}
          onRedeemSuccess={() => loadDashboard(true)}
        />

        {/* Recommended Quizzes Section */}
        {recommendedQuizzes.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-navy-900">اختبارات مقترحة لصفك الدراسي</h3>
                <p className="text-xs sm:text-sm text-slate-500">اختبارات موجهة ومطابقة لمنهاج {student.grade}</p>
              </div>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-400 transition"
              >
                <span>عرض الكل</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedQuizzes.map((quiz, idx) => (
                <QuizCard key={quiz.id} quiz={quiz} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Activity Ledger Timeline */}
        <div className="mb-8">
          <RecentLedger
            transactions={recentTransactions}
            submissions={recentSubmissions}
          />
        </div>
      </div>

      {/* Interactive Prestige Roadmap Modal */}
      <PrestigeRoadmapModal
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
        currentPoints={student.points}
        currentLevel={student.level}
        nextLevel={student.prestige?.nextLevel}
        progressPercent={student.prestige?.progressPercent}
      />
    </div>
  );
}
