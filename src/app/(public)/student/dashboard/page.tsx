import React from 'react';
import StudentDashboardClient from '@/components/student/StudentDashboardClient';

export const metadata = {
  title: 'لوحة تحكم الطالب | منصة مركز القدومي الثقافي',
  description: 'بوابة الطالب لمتابعة رصيد النقاط، الرتبة التنافسية، وسجل الاختبارات المكتملة',
};

export default function StudentDashboardPage() {
  return <StudentDashboardClient />;
}
