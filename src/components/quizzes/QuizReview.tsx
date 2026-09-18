'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, ArrowRight, RotateCcw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export interface ReviewQuestionOption {
  id: number;
  text: string;
}

export interface ReviewItem {
  questionId: number;
  questionText: string;
  selectedOptionId: number | null;
  correctOptionId: number | null;
  isCorrect: boolean;
  explanation?: string | null;
  options?: ReviewQuestionOption[];
}

export interface QuizReviewProps {
  quizTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  review: ReviewItem[];
  onBackToResults: () => void;
  onRetake: () => void;
}

export default function QuizReview({
  quizTitle,
  score,
  correctAnswers,
  totalQuestions,
  review,
  onBackToResults,
  onRetake,
}: QuizReviewProps) {
  const incorrectCount = totalQuestions - correctAnswers;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8" dir="rtl">
      {/* Header Summary */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-cyan-600">مراجعة الاختبار والشروحات</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{quizTitle}</h2>
          </div>
          <button
            onClick={onBackToResults}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لنتيجة التقييم</span>
          </button>
        </div>

        {/* Quick Stats Pill */}
        <div className="grid grid-cols-3 gap-3 pt-4 text-center">
          <div className="rounded-2xl bg-cyan-50/70 p-3 border border-cyan-100">
            <span className="block text-xl font-black text-cyan-700">{score}%</span>
            <span className="text-xs font-semibold text-slate-500">الدرجة النهائية</span>
          </div>
          <div className="rounded-2xl bg-emerald-50/70 p-3 border border-emerald-100">
            <span className="block text-xl font-black text-emerald-600">{correctAnswers}</span>
            <span className="text-xs font-semibold text-slate-500">إجابات صحيحة</span>
          </div>
          <div className="rounded-2xl bg-rose-50/70 p-3 border border-rose-100">
            <span className="block text-xl font-black text-rose-600">{incorrectCount}</span>
            <span className="text-xs font-semibold text-slate-500">إجابات خاطئة</span>
          </div>
        </div>
      </div>

      {/* Review Questions List */}
      <div className="space-y-6">
        {review.map((item, index) => {
          const isCorrect = item.isCorrect;

          return (
            <motion.div
              key={item.questionId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`rounded-3xl border p-6 shadow-sm transition-all duration-200 ${
                isCorrect
                  ? 'border-emerald-200/80 bg-emerald-50/20'
                  : 'border-rose-200/80 bg-rose-50/20'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إجابة صحيحة</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>إجابة غير دقيقة</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-bold text-slate-900 mb-4 leading-relaxed">
                {item.questionText}
              </h3>

              {/* Options display if provided */}
              {item.options && item.options.length > 0 && (
                <div className="space-y-2 mb-4">
                  {item.options.map((opt) => {
                    const isSelected = item.selectedOptionId === opt.id;
                    const isThisCorrect = item.correctOptionId === opt.id;

                    let cardStyle = 'border-slate-200 bg-white text-slate-700';
                    let statusLabel: React.ReactNode = null;

                    if (isThisCorrect) {
                      cardStyle = 'border-emerald-400 bg-emerald-50/80 text-emerald-900 font-bold';
                      statusLabel = (
                        <span className="text-xs text-emerald-700 font-bold mr-auto">
                          (الإجابة الصحيحة النموذجية)
                        </span>
                      );
                    } else if (isSelected && !isThisCorrect) {
                      cardStyle = 'border-rose-400 bg-rose-50/80 text-rose-900 font-medium';
                      statusLabel = (
                        <span className="text-xs text-rose-700 font-bold mr-auto">
                          (إجابتك المختارة)
                        </span>
                      );
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                              isThisCorrect
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : isSelected
                                ? 'border-rose-600 bg-rose-600 text-white'
                                : 'border-slate-300 bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isThisCorrect ? '✓' : isSelected ? '✕' : ''}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {statusLabel}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pedagogical Explanation Box */}
              {item.explanation && (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-900">
                  <div className="flex items-center gap-2 mb-1 font-bold text-amber-800">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>توضيح المعلم النموذجي:</span>
                  </div>
                  <p className="leading-relaxed pr-6 text-amber-950/90">{item.explanation}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pb-8">
        <button
          onClick={onRetake}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-cyan-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة المحاولة الآن</span>
        </button>

        <Link
          href="/student/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-500" />
          <span>الذهاب إلى لوحة تحكم الطالب</span>
        </Link>
      </div>
    </div>
  );
}
