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

type QuizViewMode = 'taking' | 'celebrating' | 'review';

interface SubmissionResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  pointsEarned: number;
  newTotalPoints: number;
  level: string;
  review: ReviewItem[];
}

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<QuizViewMode>('taking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  // 1. Fetch current student identity (from cookie session via /api/student/me)
  useEffect(() => {
    async function checkStudent() {
      try {
        const res = await fetch('/api/student/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.student) {
            setStudentId(data.student.id);
          }
        }
      } catch {
        // Non-fatal, studentId might be inferred from cookie on backend
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
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('الاختبار المطلوب غير موجود أو تم إيقافه.');
          }
          throw new Error('حدث خطأ أثناء تحميل الاختبار.');
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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/20 to-white pt-28 pb-20 overflow-hidden" dir="rtl">
      {/* Background Blobs */}
      <OrganicBlob variant="cyan" size="2xl" className="-top-40 -left-40 opacity-20" />
      <OrganicBlob variant="electric" size="xl" className="top-1/2 -right-32 opacity-25" />

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <RefreshCw className="w-10 h-10 text-cyan-600 animate-spin mb-4" />
          <p className="text-base font-bold text-slate-700">جاري تجهيز الاختبار المحوسب...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">عذراً، تعذر فتح الاختبار</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
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
