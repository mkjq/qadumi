'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, ChevronLeft, Send, AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export interface QuizOptionData {
  id: number;
  text: string;
  order: number;
}

export interface QuizQuestionData {
  id: number;
  question: string;
  points: number;
  order: number;
  options: QuizOptionData[];
}

export interface QuizData {
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
  questions: QuizQuestionData[];
}

export interface QuizRunnerProps {
  quiz: QuizData;
  onSubmit: (answers: Record<number, number>) => Promise<void>;
  isSubmitting: boolean;
}

const arabicOptionLetters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

export default function QuizRunner({ quiz, onSubmit, isSubmitting }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cheatWarnings, setCheatWarnings] = useState(0);

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Countdown timer effect
  useEffect(() => {
    if (quiz.durationMinutes <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          onSubmit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.durationMinutes, answers, onSubmit]);

  // Anti-Cheat: Detect blur/visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings((prev) => {
          const newWarnings = prev + 1;
          if (newWarnings >= 3) {
            toast.error('تم إنهاء الاختبار بسبب محاولات الغش المتكررة والخروج من الصفحة.', { duration: 5000 });
            onSubmit(answers); // Auto submit on 3rd strike
          } else {
            toast.error(`تحذير مكافحة الغش: يمنع الخروج من الصفحة أثناء الاختبار! (التحذير ${newWarnings} من 3)`, { 
              duration: 5000, 
              icon: '⚠️' 
            });
          }
          return newWarnings;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [answers, onSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeLeft > 0 && timeLeft <= 60; // 1 min or less

  const handleSelectOption = (optionId: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAttempt = () => {
    if (unansweredCount > 0) {
      setShowConfirmModal(true);
    } else {
      onSubmit(answers);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center" dir="rtl">
        <p className="text-slate-400 font-bold">لا توجد أسئلة متاحة في هذا الاختبار.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] font-arabic" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Anti-cheat Header warning */}
        {cheatWarnings > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4">
            <div className="flex items-center gap-3 text-rose-400 font-bold">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>نظام مكافحة الغش نشط - تم تسجيل خروج من الصفحة ({cheatWarnings}/3)</span>
            </div>
          </div>
        )}

        {/* Quiz Top Bar */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">
                  {quiz.subject}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                  {quiz.grade}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{quiz.title}</h1>
            </div>

            {/* Countdown Timer */}
            {quiz.durationMinutes > 0 && (
              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all shadow-lg ${
                  isTimeCritical
                    ? 'border-rose-500/50 bg-rose-500/20 text-rose-400 animate-pulse'
                    : 'border-white/10 bg-white/5 text-slate-200'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono text-base font-black">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span>
                السؤال <strong className="text-white">{currentIndex + 1}</strong> من {totalQuestions}
              </span>
              <span className="text-cyan-400 font-black">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Question Bubbles Stepper */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-2 scrollbar-none">
            {quiz.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex h-8 min-w-[2rem] items-center justify-center rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    isCurrent
                      ? 'bg-cyan-500 text-navy-900 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#091C3B] scale-110 shadow-lg shadow-cyan-500/20'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-2xl backdrop-blur-md"
          >
            {/* Question Text */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-3">
                <HelpCircle className="w-5 h-5" />
                <span>السؤال رقم {currentIndex + 1} ({currentQuestion.points || 10} درجات)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                const letter = arabicOptionLetters[optIdx] || String(optIdx + 1);

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectOption(option.id)}
                    className={`group flex w-full items-center justify-between rounded-2xl border p-5 text-right transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 text-white font-bold shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                          isSelected
                            ? 'bg-cyan-500 text-navy-900 shadow-md'
                            : 'bg-white/10 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-base sm:text-lg leading-snug">{option.text}</span>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400 text-navy-900'
                          : 'border-slate-500 bg-transparent'
                      }`}
                    >
                      {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-navy-900" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-cyan-500"
            >
              <span>التالي</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitAttempt}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري تصحيح الاختبار...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>إنهاء وإرسال الاختبار</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Confirmation Modal if Unanswered Questions Remain */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#051124]/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#091C3B] p-8 shadow-2xl text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-4 ring-amber-500/10">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">تأكيد إرسال الاختبار</h3>
              <p className="text-base text-slate-300 mb-8 leading-relaxed">
                لديك <strong className="text-amber-400 font-bold mx-1">{unansweredCount}</strong> سؤال بدون إجابة من أصل {totalQuestions}. هل أنت متأكد من رغبتك في تسليم الاختبار الآن؟
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  العودة للإجابة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    onSubmit(answers);
                  }}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition"
                >
                  إرسال رغم ذلك
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
