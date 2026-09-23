'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, Award, Star, CheckCircle2, X, MapPin, ChevronLeft, Gift, Zap,  } from 'lucide-react';

export interface PrestigeRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  currentLevel: string;
  nextLevel?: string | null;
  progressPercent?: number;
}

interface TierDefinition {
  id: string;
  title: string;
  pointsRange: string;
  minPoints: number;
  maxPoints: number;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  bgGradient: string;
  description: string;
  perks: string[];
}

const PRESTIGE_TIERS: TierDefinition[] = [
  {
    id: 'beginner',
    title: 'مبتدئ',
    pointsRange: '0 - 99 نقطة',
    minPoints: 0,
    maxPoints: 99,
    icon: Medal,
    badgeBg: 'bg-white/10 border-slate-300',
    badgeText: 'text-slate-700',
    borderColor: 'border-white/10',
    bgGradient: 'from-slate-50 to-white',
    description: 'المرحلة التأسيسية والانطلاقة في رحلة التفوق الأكاديمي بمنصة مركز القدومي.',
    perks: [
      'الوصول الكامل لجميع الاختبارات التشخيصية لمواد صفك',
      'هدية ترحيبية 20 نقطة مجانية فور التسجيل',
      'سجل تاريخي تفصيلي للعلامات وإجابات الأسئلة',
    ],
  },
  {
    id: 'advanced',
    title: 'متقدم',
    pointsRange: '100 - 299 نقطة',
    minPoints: 100,
    maxPoints: 299,
    icon: Award,
    badgeBg: 'bg-cyan-50 border-cyan-300',
    badgeText: 'text-cyan-700',
    borderColor: 'border-cyan-300',
    bgGradient: 'from-cyan-50/40 via-white to-white',
    description: 'شارة التفوق الفضي؛ تثبت الالتزام المستمر بحل الاختبارات الدورية وتحقيق نتائج ممتازة.',
    perks: [
      'فتح إمكانية استبدال الدوسيات والملخصات الوزارية مجاناً',
      'شارة الرتبة الفضية اللامعة بجانب اسمك في المنصة',
      'أولوية التسجيل في ورشات المراجعة الامتحانية السريعة',
    ],
  },
  {
    id: 'hero',
    title: 'بطل القدومي',
    pointsRange: '300 - 699 نقطة',
    minPoints: 300,
    maxPoints: 699,
    icon: Trophy,
    badgeBg: 'bg-purple-50 border-purple-300',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-300',
    bgGradient: 'from-purple-50/40 via-white to-white',
    description: 'أحد نخبة الطلاب المتفوقين في المركز؛ يحظى بمزايا حصرية وخصومات تعليمية قيمة.',
    perks: [
      'خصم 20% على بطاقات أي مادة دراسية داخل المركز',
      'استبدال حقيبة مركز القدومي وقرطاسية التميز الشاملة',
      'حق الحجز المبكر لجلسات المراجعة الفردية مع أساتذة المواد',
      'تصدر اسمك في قائمة شرف الأبطال المتفوقين',
    ],
  },
  {
    id: 'legend',
    title: 'أسطورة القدومي',
    pointsRange: '700+ نقطة',
    minPoints: 700,
    maxPoints: Infinity,
    icon: Crown,
    badgeBg: 'bg-gradient-to-r from-amber-400 to-gold-500 border-amber-300',
    badgeText: 'text-white',
    borderColor: 'border-amber-400',
    bgGradient: 'from-amber-50/60 via-gold-50/20 to-white',
    description: 'التاج الشرفي الأسمى في صرح مركز القدومي الثقافي؛ تكريم استثنائي لمسيرة التميز.',
    perks: [
      'بطاقة فصل دراسي كاملة مجاناً لأي مادة تختارها 👑',
      'جلسات توجيه واستشارات دراسية خاصة VIP مع نخبة المدرسين',
      'درع التكريم السنوي في حفل أوائل الطلبة المتفوقين',
      'شارة التاج الذهبي الأسطوري الدائمة في حسابك',
    ],
  },
];

export default function PrestigeRoadmapModal({
  isOpen,
  onClose,
  currentPoints,
  currentLevel,
  nextLevel,
  progressPercent = 0,
}: PrestigeRoadmapModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-3xl my-8 rounded-3xl bg-white/5 p-6 sm:p-8 shadow-2xl border border-white/10"
            dir="rtl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-300 hover:bg-white/10 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 text-xs font-bold mb-3">
                <Star className="w-4 h-4 text-amber-500" />
                <span>نظام الرتب التنافسية للطلاب</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                خارطة طريق <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-gold-600 to-cyan-600">رتب القدومي</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                كل رتبة تمنحك مكانة شرفية وميزات حصرية داخل المركز والمنصة. استمر في حل الاختبارات لترقية مستواك!
              </p>

              {/* Current Points Status Banner */}
              <div className="mt-4 inline-flex items-center gap-4 bg-gradient-to-b from-[#051124] via-[#091C3B] to-[#0A2246] border border-white/10/80 rounded-2xl px-5 py-2.5 text-xs sm:text-sm">
                <span className="text-slate-300 font-medium">رصيدك الحالي:</span>
                <span className="font-black text-amber-600 text-base">
                  {currentPoints.toLocaleString('ar-EG')} نقطة
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-300 font-medium">رتبتك الحالية:</span>
                <span className="font-black text-navy-800 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                  {currentLevel}
                </span>
              </div>
            </div>

            {/* Tiers List */}
            <div className="space-y-4">
              {PRESTIGE_TIERS.map((tier) => {
                const isCurrent = tier.title === currentLevel;
                const isPassed = currentPoints >= tier.minPoints && !isCurrent;
                const Icon = tier.icon;

                return (
                  <div
                    key={tier.id}
                    className={`relative rounded-3xl border p-5 sm:p-6 transition-all duration-300 bg-gradient-to-r ${
                      tier.bgGradient
                    } ${
                      isCurrent
                        ? `ring-2 ring-amber-400 shadow-lg shadow-amber-500/10 ${tier.borderColor}`
                        : tier.borderColor
                    }`}
                  >
                    {/* Current Tier Floating "أنت هنا" Marker */}
                    {isCurrent && (
                      <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-gold-500 px-3.5 py-1 text-xs font-black text-white shadow-md shadow-amber-500/30 animate-pulse">
                        <MapPin className="w-3.5 h-3.5 fill-white" />
                        <span>أنت هنا حالياً</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
                            isCurrent
                              ? 'bg-gradient-to-br from-amber-500 to-gold-500 text-white shadow-amber-500/30'
                              : 'bg-white/5 border border-white/10 text-slate-700'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white">{tier.title}</h3>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${tier.badgeBg} ${tier.badgeText}`}
                            >
                              {tier.pointsRange}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{tier.description}</p>
                        </div>
                      </div>

                      {/* State tag */}
                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            المستوى النشط
                          </span>
                        ) : isPassed ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مكتمل</span>
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 bg-white/10 px-3 py-1 rounded-full">
                            يتطلب {tier.minPoints} نقطة
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs font-bold text-slate-700 mb-2">امتيازات هذه الرتبة:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tier.perks.map((perk, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end">
              <button
                onClick={onClose}
                className="rounded-2xl bg-gradient-to-r from-navy-700 to-cyan-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-cyan-600 hover:to-navy-800"
              >
                إغلاق الخارطة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
