'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startTutorial = () => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'إنهاء',
    progressText: '{{current}} من {{total}}',
    allowClose: true,
    steps: [
      {
        element: '#tour-sidebar',
        popover: {
          title: 'القائمة الجانبية',
          description: 'من هنا يمكنك التنقل بين جميع أقسام لوحة التحكم الخاصة بالمركز.',
          side: 'left',
          align: 'start'
        }
      },
      {
        element: '#tour-user-info',
        popover: {
          title: 'معلومات الحساب',
          description: 'هنا يظهر اسم المستخدم الذي قمت بتسجيل الدخول به.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-view-site',
        popover: {
          title: 'عرض الموقع',
          description: 'اضغط هنا لفتح الواجهة الرئيسية للموقع في نافذة جديدة لرؤية التغييرات.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#tour-logout',
        popover: {
          title: 'تسجيل الخروج',
          description: 'يمكنك تسجيل الخروج من حسابك بأمان من هنا.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#tour-tutorial-btn',
        popover: {
          title: 'إعادة الشرح',
          description: 'إذا احتجت لتذكر وظائف لوحة التحكم، يمكنك دائماً الضغط هنا لإعادة هذا الشرح.',
          side: 'bottom',
          align: 'start'
        }
      }
    ]
  });

  driverObj.drive();
};

export default function TutorialTour() {
  useEffect(() => {
    // Check if the user has already seen the tutorial
    const hasSeenTutorial = localStorage.getItem('hasSeenAdminTutorial');
    
    if (!hasSeenTutorial) {
      // Small delay to ensure elements are rendered
      setTimeout(() => {
        startTutorial();
      }, 500);
      localStorage.setItem('hasSeenAdminTutorial', 'true');
    }
  }, []);

  return null;
}
