'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import QuizRunner, { QuizData } from '@/components/quizzes/QuizRunner';
import QuizCelebration from '@/components/quizzes/QuizCelebration';
import QuizReview, { ReviewItem } from '@/components/quizzes/QuizReview';
import OrganicBlob from '@/components/ui/OrganicBlob';

type QuizViewMode = 'auth-required' | 'taking' | 'celebrating' | 'review';

interface SubmissionResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  pointsEarned: number;
  newTotalPoints: number;
  level: string;
  review: ReviewItem[];
  isFirstAttempt: boolean;
}

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<QuizViewMode>('auth-required');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // 1. Fetch current student identity (from cookie session via /api/student/me)
  useEffect(() => {
    async function checkStudent() {
      try {
        const res = await fetch('/api/student/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.student) {
            setStudentId(data.student.id);
            setViewMode('taking');
          }
        }
      } catch {
        // Non-fatal
      } finally {
        setAuthChecked(true);
      }
    }
    checkStudent();
  }, []);

  // 2. Fetch Quiz Details
  useEffect(() => {
    async function loadQuiz() {
      if (!quizId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/quizzes/${quizId}?_t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('الاختبار المطلوب غير موجود أو تم إيقافه.');
          }
          throw new Error(`حدث خطأ أثناء تحميل الاختبار. (كود: ${res.status})`);
        }
        const data = await res.json();
        if (data.quiz) {
          setQuiz(data.quiz);
        } else {
          throw new Error('بيانات الاختبار غير متوفرة.');
        }
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل الاختبار');
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  // 3. Handle Quiz Submission
  const handleSubmit = async (answers: Record<number, number>) => {
    try {
      setIsSubmitting(true);

      const payload: Record<string, any> = { answers };
      if (studentId) {
        payload.studentId = studentId;
      }

      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'فشل في إرسال إجابات الاختبار');
      }

      const data = await res.json();

      // Enrich review items with option texts from the loaded quiz
      const enrichedReview: ReviewItem[] = (data.review || []).map((rev: any) => {
        const matchingQuestion = quiz?.questions.find((q) => q.id === rev.questionId);
        return {
          ...rev,
          options: matchingQuestion ? matchingQuestion.options : [],
        };
      });

      setSubmissionResult({
        score: data.score,
        correctAnswers: data.correctAnswers,
        totalQuestions: data.totalQuestions,
        pointsEarned: data.pointsEarned,
        newTotalPoints: data.newTotalPoints,
        level: data.level || 'مبتدئ',
        review: enrichedReview,
        isFirstAttempt: data.isFirstAttempt !== false,
      });

      setViewMode('celebrating');
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تصحيح الاختبار، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSubmissionResult(null);
    setViewMode('taking');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-[#0B1D3A] to-slate-900 pt-28 pb-20 overflow-hidden" dir="rtl">
      {/* Background Blobs */}
      <OrganicBlob variant="cyan" size="2xl" className="-top-40 -left-40 opacity-20" />
      <OrganicBlob variant="electric" size="xl" className="top-1/2 -right-32 opacity-25" />

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <RefreshCw className="w-10 h-10 text-cyan-600 animate-spin mb-4" />
          <p className="text-base font-bold text-white">جاري تجهيز الاختبار المحوسب...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">عذراً، تعذر فتح الاختبار</h2>
          <p className="text-sm text-slate-300 mb-6">{error}</p>
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لجميع الاختبارات</span>
          </Link>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && quiz && (
        <>
          {viewMode === 'auth-required' && authChecked && (
            <div className="mx-auto max-w-lg px-4 py-16 text-center" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/10 bg-[#091C3B]/90 p-10 shadow-2xl backdrop-blur-xl"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 ring-4 ring-cyan-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-3">سجّل حسابك أولاً!</h2>
                <p className="text-base text-slate-300 mb-8 leading-relaxed">
                  لبدء الاختبار وجمع النقاط، يجب عليك إنشاء حساب أو تسجيل الدخول أولاً.
                  سيتم حفظ نقاطك وتقدمك تلقائياً.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/student/register?returnUrl=${encodeURIComponent(`/quizzes/${quizId}`)}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                    <span>إنشاء حساب جديد</span>
                  </Link>
                  <Link
                    href={`/student/login?returnUrl=${encodeURIComponent(`/quizzes/${quizId}`)}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                  >
                    <span>تسجيل الدخول</span>
                  </Link>
                </div>
                <p className="text-xs text-slate-400 mt-6">🎁 هدية الانضمام: 20 نقطة مجانية عند إنشاء حساب جديد!</p>
              </motion.div>
            </div>
          )}

          {viewMode === 'taking' && (
            <QuizRunner
              quiz={quiz}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {viewMode === 'celebrating' && submissionResult && (
            <QuizCelebration
              score={submissionResult.score}
              correctAnswers={submissionResult.correctAnswers}
              totalQuestions={submissionResult.totalQuestions}
              pointsEarned={submissionResult.pointsEarned}
              newTotalPoints={submissionResult.newTotalPoints}
              level={submissionResult.level}
              isFirstAttempt={submissionResult.isFirstAttempt}
              onReviewClick={() => setViewMode('review')}
              onRetakeClick={handleRetake}
            />
          )}

          {viewMode === 'review' && submissionResult && (
            <QuizReview
              quizTitle={quiz.title}
              score={submissionResult.score}
              correctAnswers={submissionResult.correctAnswers}
              totalQuestions={submissionResult.totalQuestions}
              review={submissionResult.review}
              onBackToResults={() => setViewMode('celebrating')}
              onRetake={handleRetake}
            />
          )}
        </>
      )}
    </div>
  );
}
