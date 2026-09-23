'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  Coins,
  ShoppingBag,
  Percent,
  BookOpen,
  UserCheck,
  Package,
  CreditCard,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface RewardItem {
  id: number;
  title: string;
  description: string | null;
  pointsCost: number;
  icon?: string | null;
  isActive: boolean;
}

export interface RewardsShowcaseProps {
  studentPoints: number;
  studentId?: number;
  onRedeemSuccess?: () => void;
}

// Icon helper based on reward title or icon string
function getRewardIcon(title: string, iconStr?: string | null) {
  if (iconStr === 'percent' || title.includes('خصم')) return Percent;
  if (iconStr === 'book' || title.includes('دوسية') || title.includes('كتاب')) return BookOpen;
  if (iconStr === 'user' || title.includes('جلسة') || title.includes('توجيه')) return UserCheck;
  if (iconStr === 'bag' || title.includes('حقيبة') || title.includes('قرطاسية')) return Package;
  if (iconStr === 'card' || title.includes('بطاقة') || title.includes('فصل')) return CreditCard;
  return Gift;
}

export default function RewardsShowcase({
  studentPoints,
  studentId,
  onRedeemSuccess,
}: RewardsShowcaseProps) {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionError, setRedemptionError] = useState<string | null>(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRewards() {
      try {
        setLoading(true);
        const res = await fetch('/api/rewards');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.rewards)) {
            setRewards(data.rewards);
          }
        }
      } catch (err) {
        console.error('Failed to fetch rewards:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRewards();
  }, []);

  const handleOpenModal = (reward: RewardItem) => {
    setSelectedReward(reward);
    setRedemptionError(null);
    setRedemptionSuccess(null);
  };

  const handleCloseModal = () => {
    if (isRedeeming) return;
    setSelectedReward(null);
    setRedemptionError(null);
    setRedemptionSuccess(null);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    setIsRedeeming(true);
    setRedemptionError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('student_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          rewardId: selectedReward.id,
          studentId: studentId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRedemptionError(data.error || 'تعذر استبدال الجائزة، يرجى المحاولة لاحقاً');
        return;
      }

      const msg = data.message || `تم استبدال مكافأة "${selectedReward.title}" بنجاح!`;
      setRedemptionSuccess(msg);
      toast.success(msg, { duration: 4000 });

      if (onRedeemSuccess) {
        onRedeemSuccess();
      }

      // Auto close modal after brief delay
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      setRedemptionError('حدث خطأ في الاتصال بالخادم، يرجى المحاولة مجدداً');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold mb-2">
            <Gift className="w-4 h-4 text-amber-600" />
            <span>متجر المكافآت والجوائز</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-900 flex items-center gap-2">
            <span>استبدل نقاطك بهدايا حقيقية</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
              رصيدك: {studentPoints.toLocaleString('ar-EG')} نقطة
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اجمع النقاط من حل الاختبارات التشخيصية واستبدلها بخصومات، دوسيات، وجلسات تدريسية مجانية
          </p>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-12 w-12 rounded-2xl bg-white/20" />
                <div className="h-6 w-20 rounded-full bg-white/20" />
              </div>
              <div className="h-5 w-40 rounded-lg bg-white/20" />
              <div className="h-4 w-full rounded-lg bg-white/20" />
              <div className="h-11 rounded-2xl bg-white/20" />
            </div>
          ))}
        </div>
      ) : rewards.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-sm">
          لا توجد مكافآت متاحة حالياً في المتجر. تابع معنا لاحقاً!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => {
            const isUnlocked = studentPoints >= reward.pointsCost;
            const pointsNeeded = Math.max(0, reward.pointsCost - studentPoints);
            const progressPercent = Math.min(100, Math.round((studentPoints / reward.pointsCost) * 100));
            const Icon = getRewardIcon(reward.title, reward.icon);

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-md transition-all duration-300 ${
                  isUnlocked
                    ? 'border-amber-300/80 bg-gradient-to-b from-white via-amber-50/15 to-white shadow-sm hover:shadow-xl hover:shadow-amber-500/10'
                    : 'border-slate-200 bg-white opacity-90 hover:opacity-100 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top: Icon and Points Cost */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-navy-900 shadow-amber-500/20'
                          : 'bg-white/10 text-slate-500'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 text-sm font-black text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{reward.pointsCost.toLocaleString('ar-EG')} نقطة</span>
                      </span>

                      <span
                        className={`text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                          isUnlocked
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-500 bg-white/10'
                        }`}
                      >
                        {isUnlocked ? 'متاح للاستبدال' : `متبقي ${pointsNeeded} نقطة`}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-navy-900 mb-2 group-hover:text-navy-800 transition-colors">
                    {reward.title}
                  </h3>

                  {/* Description */}
                  {reward.description && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {reward.description}
                    </p>
                  )}

                  {/* Progress towards unlock if locked */}
                  {!isUnlocked && (
                    <div className="mb-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-2.5 border border-slate-200">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
                        <span>التقدم نحو المكافأة:</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-slate-200">
                  {isUnlocked ? (
                    <button
                      onClick={() => handleOpenModal(reward)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-gold-600 px-4 py-3 text-xs sm:text-sm font-bold text-navy-900 shadow-md shadow-amber-500/20 transition-all hover:brightness-105 active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>استبدال المكافأة الآن</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-slate-500 cursor-not-allowed border border-slate-200/60"
                    >
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span>اجمع النقاط لفتح المكافأة</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                disabled={isRedeeming}
                className="absolute top-5 left-5 p-2 rounded-full text-slate-500 hover:text-slate-600 hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-inner">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-navy-900 mb-1">
                  تأكيد استبدال المكافأة
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  هل ترغب في خصم النقاط واستلام هذه الجائزة من مركز القدومي؟
                </p>
              </div>

              {/* Reward Details Box */}
              <div className="mb-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 p-4">
                <h4 className="font-bold text-navy-900 text-sm mb-1">
                  {selectedReward.title}
                </h4>
                {selectedReward.description && (
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {selectedReward.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/60">
                  <span className="text-slate-600 font-medium">تكلفة الاستبدال:</span>
                  <span className="font-black text-amber-700">
                    -{selectedReward.pointsCost} نقطة
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600 font-medium">رصيدك المتبقي بعد الاستبدال:</span>
                  <span className="font-black text-emerald-700">
                    {(studentPoints - selectedReward.pointsCost).toLocaleString('ar-EG')} نقطة
                  </span>
                </div>
              </div>

              {/* Feedback messages */}
              {redemptionError && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{redemptionError}</span>
                </div>
              )}

              {redemptionSuccess && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{redemptionSuccess}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmRedeem}
                  disabled={isRedeeming || !!redemptionSuccess}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-gold-600 py-3.5 px-4 text-xs sm:text-sm font-bold text-navy-900 shadow-md shadow-amber-500/20 transition hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>تأكيد الاستبدال</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCloseModal}
                  disabled={isRedeeming}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:bg-gradient-to-b from-slate-50 to-slate-100"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
