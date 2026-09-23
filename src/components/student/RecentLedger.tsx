'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Award, CheckCircle2, Clock, Gift, Star, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export interface PointTransactionItem {
  id: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export interface QuizSubmissionItem {
  id: number;
  quizTitle: string;
  subject?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  pointsEarned: number;
  completedAt: string;
}

export interface RecentLedgerProps {
  transactions: PointTransactionItem[];
  submissions: QuizSubmissionItem[];
}

export default function RecentLedger({ transactions = [], submissions = [] }: RecentLedgerProps) {
  const [activeTab, setActiveTab] = useState<'points' | 'quizzes'>('points');

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'QUIZ_REWARD':
        return { label: 'مكافأة اختبار', icon: Award, color: 'text-cyan-600 bg-cyan-50' };
      case 'WELCOME_BONUS':
        return { label: 'هدية التسجيل', icon: Gift, color: 'text-amber-600 bg-amber-50' };
      case 'REWARD_REDEMPTION':
        return { label: 'استبدال جائزة', icon: Gift, color: 'text-purple-600 bg-purple-50' };
      default:
        return { label: 'نقاط', icon: Star, color: 'text-slate-600 bg-gradient-to-b from-slate-50 to-slate-100' };
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md">
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-black text-slate-100">سجل النشاط والمعاملات</h3>
        </div>

        <div className="flex rounded-2xl bg-white/10 p-1">
          <button
            onClick={() => setActiveTab('points')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'points'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-100'
            }`}
          >
            سجل النقاط ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'quizzes'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-100'
            }`}
          >
            الاختبارات المنجزة ({submissions.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'points' && (
          <motion.div
            key="points-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const isPositive = tx.amount > 0;
                const typeMeta = getTransactionTypeLabel(tx.type);
                const IconComponent = typeMeta.icon;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/50 p-3.5 transition-colors hover:bg-gradient-to-b from-slate-50 to-slate-100 hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeMeta.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100 line-clamp-1">{tx.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{typeMeta.label}</span>
                          <span>•</span>
                          <span>{formatDate(tx.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount Chip */}
                    <div
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-black ${
                        isPositive
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isPositive ? (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>+{tx.amount} نقطة</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>{tx.amount} نقطة</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-500">
                <History className="mx-auto w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-bold">لا توجد حركات نقاط مسجلة بعد.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'quizzes' && (
          <motion.div
            key="quizzes-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/50 p-4 transition-colors hover:bg-gradient-to-b from-slate-50 to-slate-100 hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 font-black text-sm">
                      {sub.score}%
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{sub.quizTitle}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        {sub.subject && <span className="font-semibold text-cyan-700">{sub.subject}</span>}
                        {sub.subject && <span>•</span>}
                        <span>{sub.correctAnswers} من {sub.totalQuestions} إجابة صحيحة</span>
                        <span>•</span>
                        <span>{formatDate(sub.completedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-extrabold text-amber-700">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      +{sub.pointsEarned} نقطة
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500">
                <CheckCircle2 className="mx-auto w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-bold">لم تقم بإجراء اختبارات بعد.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
