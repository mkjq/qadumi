'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MessageSquare, Settings, TrendingUp, GraduationCap, Clock, Phone } from 'lucide-react';

interface Stats {
  teachersCount: number;
  messagesCount: number;
  unreadMessages: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ teachersCount: 0, messagesCount: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/teachers').then((r) => r.json()),
      fetch('/api/messages').then((r) => r.json()),
    ]).then(([teachers, messages]) => {
      setStats({
        teachersCount: teachers.length,
        messagesCount: messages.length,
        unreadMessages: messages.filter((m: any) => !m.isRead).length,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const quickLinks = [
    {
      href: '/admin/teachers',
      icon: Users,
      title: 'إدارة الأساتذة',
      desc: 'إضافة، تعديل، حذف الأساتذة',
      color: 'bg-blue-500',
      value: loading ? '...' : stats.teachersCount,
      label: 'أستاذ',
    },
    {
      href: '/admin/messages',
      icon: MessageSquare,
      title: 'الرسائل الواردة',
      desc: 'رسائل التواصل من الطلاب',
      color: 'bg-green-500',
      value: loading ? '...' : stats.messagesCount,
      label: 'رسالة',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
    {
      href: '/admin/settings',
      icon: Settings,
      title: 'إعدادات المركز',
      desc: 'معلومات الاتصال وأوقات الدوام',
      color: 'bg-purple-500',
      value: null,
      label: '',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">مرحبًا بك في لوحة إدارة مركز القدومي الثقافي</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.teachersCount}</div>
              <div className="text-gray-500 text-sm">أستاذ نشط</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.unreadMessages}</div>
              <div className="text-gray-500 text-sm">رسائل غير مقروءة</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99%</div>
              <div className="text-gray-500 text-sm">نسبة النجاح</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge} جديد
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
            {item.value !== null && (
              <div className="mt-3 text-2xl font-bold text-primary-700">
                {item.value} <span className="text-sm font-normal text-gray-500">{item.label}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Center Info Quick View */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary-600" />
          معلومات المركز السريعة
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">2:00 ظهرًا - 9:00 مساءً</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 ltr">0791586891</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">+50,000 خريج منذ 2000م</span>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/admin/settings" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
            تعديل المعلومات ←
          </Link>
        </div>
      </div>
    </div>
  );
}
