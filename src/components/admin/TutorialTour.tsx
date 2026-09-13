'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { CallBackProps, Step, TooltipRenderProps } from 'react-joyride';
import { STATUS } from 'react-joyride';
import dynamic from 'next/dynamic';

const JoyrideNoSSR = dynamic(() => import('./JoyrideWrapper'), { ssr: false });

// Define the steps for each page contextually
const ALL_STEPS: Record<string, Step[]> = {
  '/admin/dashboard': [
    {
      target: '#tour-sidebar',
      title: 'القائمة الجانبية',
      content: 'من هنا يمكنك التنقل بين جميع أقسام لوحة التحكم الخاصة بالمركز بسرعة وسهولة.',
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '#tour-dashboard-stats',
      title: 'إحصائيات المركز',
      content: 'نظرة سريعة على أهم الأرقام: عدد الأساتذة، الرسائل، والمبيعات الإجمالية.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#tour-dashboard-charts',
      title: 'الرسوم البيانية للمبيعات',
      content: 'راقب أداء مبيعاتك اليومية وعدد الطلبات الواردة خلال الأيام السبعة الماضية لتتخذ قرارات أفضل.',
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#tour-dashboard-quick',
      title: 'الوصول السريع',
      content: 'اختصارات مباشرة لأهم أقسام الإدارة لتوفر وقتك وجهدك.',
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#tour-user-info',
      title: 'معلومات حسابك',
      content: 'هنا يظهر حسابك الحالي، وبجانبه زر إعادة هذا الشرح في حال رغبت بتذكره لاحقاً.',
      placement: 'bottom',
      disableBeacon: true,
    }
  ],
  '/admin/teachers': [
    {
      target: '#tour-add-teacher',
      title: 'إضافة أستاذ جديد',
      content: 'اضغط هنا لفتح نموذج إضافة أستاذ جديد. يمكنك إدخال كافة تفاصيله وصورته وحسابات التواصل الخاصة به.',
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '#tour-teachers-list',
      title: 'قائمة الأساتذة',
      content: 'هنا يظهر جميع الأساتذة المسجلين. يمكنك تعديل بياناتهم، حذفهم، أو التحكم بظهورهم للطلاب بكل سهولة.',
      placement: 'top',
      disableBeacon: true,
    }
  ],
  '/admin/orders': [
    {
      target: '#tour-orders-search',
      title: 'البحث المتقدم',
      content: 'يمكنك البحث عن أي طلب بسهولة باستخدام رقم هاتف الطالب، اسمه، أو حتى اسم البطاقة المطلوبة.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#tour-orders-table',
      title: 'جدول الطلبات',
      content: 'هنا تجد كافة الطلبات. يمكنك مراجعة الإيصالات، ومن ثم الموافقة على الطلب ليتم تفعيله أو رفضه.',
      placement: 'top',
      disableBeacon: true,
    }
  ],
  '/admin/cards': [
    {
      target: '#tour-add-card',
      title: 'إضافة بطاقة جديدة',
      content: 'من هنا يمكنك طرح بطاقة جديدة للبيع، وتحديد سعرها واسم الأستاذ الخاص بها بكل سهولة.',
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '#tour-cards-search',
      title: 'البحث السريع',
      content: 'ابحث هنا لتجد أي بطاقة مسجلة في المتجر بشكل فوري وسريع.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#tour-cards-table',
      title: 'قائمة البطاقات',
      content: 'تستطيع تعديل سعر البطاقة، تعطيل بيعها، أو إيقافها تماماً من خلال هذه القائمة.',
      placement: 'top',
      disableBeacon: true,
    }
  ],
};

const DEFAULT_STEPS: Step[] = [
  {
    target: '#tour-sidebar',
    title: 'القائمة الجانبية',
    content: 'استخدم هذه القائمة للتنقل بين كل أقسام لوحة التحكم (الأساتذة، الطلبات، البطاقات، وغيرها).',
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '#tour-user-info',
    title: 'تفعيل الشرح المخصص',
    content: 'إذا انتقلت إلى أي صفحة (مثل صفحة الطلبات)، اضغط على هذا الزر وسأقوم بشرح عناصر تلك الصفحة لك بشكل مخصص!',
    placement: 'bottom',
    disableBeacon: true,
  }
];

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) => (
  <div {...tooltipProps} className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700/50 max-w-[380px] font-arabic relative overflow-hidden" dir="rtl">
    {/* Decorative background glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
    
    <div className="relative z-10 mb-5">
      {step.title && <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
        {step.title}
      </h3>}
      <p className="text-slate-300 text-sm leading-relaxed">{step.content}</p>
    </div>
    
    <div className="relative z-10 flex items-center justify-between mt-6">
      <div className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
        الخطوة {index + 1}
      </div>
      
      <div className="flex gap-2">
        {index > 0 && (
          <button {...backProps} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            السابق
          </button>
        )}
        <button {...primaryProps} className="px-5 py-2 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 transition-all text-white shadow-lg shadow-primary-600/30 active:scale-95">
          {continuous ? 'التالي' : 'إنهاء الشرح'}
        </button>
      </div>
    </div>
  </div>
);

export default function TutorialTour() {
  const pathname = usePathname();
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  useEffect(() => {
    // Check if there are steps for the current page
    const pageSteps = ALL_STEPS[pathname];
    
    if (pageSteps && pageSteps.length > 0) {
      const storageKey = `tour_seen_${pathname.replace(/\//g, '_')}`;
      const hasSeen = localStorage.getItem(storageKey);
      
      if (!hasSeen) {
        setSteps(pageSteps);
        // Delay to ensure elements are mounted before starting tour
        const timer = setTimeout(() => {
          setTourKey(prev => prev + 1);
          setRun(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } else {
      setRun(false);
    }
  }, [pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Mark as seen for this specific page
      const storageKey = `tour_seen_${pathname.replace(/\//g, '_')}`;
      localStorage.setItem(storageKey, 'true');
    }
  };

  // Allow manual trigger from window event
  useEffect(() => {
    const handleStartTour = () => {
      const pageSteps = ALL_STEPS[pathname];
      if (pageSteps && pageSteps.length > 0) {
        setSteps(pageSteps);
        setTourKey(prev => prev + 1);
        setRun(true);
      } else {
        // If they click tutorial on a page with no specific steps, show a default tour
        setSteps(DEFAULT_STEPS); 
        setTourKey(prev => prev + 1);
        setRun(true);
      }
    };
    
    window.addEventListener('start-tour', handleStartTour);
    return () => window.removeEventListener('start-tour', handleStartTour);
  }, [pathname]);

  if (!steps.length && !run) return null;

  return (
    <JoyrideNoSSR
      key={tourKey}
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showSkipButton={false}
      steps={steps}
      tooltipComponent={CustomTooltip}
      disableOverlayClose={false}
      styles={{
        options: {
          zIndex: 10000,
          overlayColor: 'rgba(0, 0, 0, 0.85)', // Very dark overlay for maximum focus
        },
      }}
    />
  );
}

export const startTutorial = () => {
  window.dispatchEvent(new Event('start-tour'));
};
