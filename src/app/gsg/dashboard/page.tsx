'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MessageSquare, Settings, TrendingUp, GraduationCap, Clock, Phone, ShoppingCart, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface ChartData {
  date: string;
  orders: number;
  revenue: number;
}

interface Stats {
  teachersCount: number;
  messagesCount: number;
  unreadMessages: number;
  ordersCount: number;
  totalRevenue: number;
  chartData: ChartData[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const quickLinks = [
    {
      href: '/gsg/teachers',
      icon: Users,
      title: 'إدارة الأساتذة',
      desc: 'إضافة، تعديل، حذف الأساتذة',
      color: 'bg-blue-500',
      value: loading ? '...' : stats?.teachersCount,
      label: 'أستاذ',
    },
    {
      href: '/gsg/messages',
      icon: MessageSquare,
      title: 'الرسائل الواردة',
      desc: 'رسائل التواصل من الطلاب',
      color: 'bg-green-500',
      value: loading ? '...' : stats?.messagesCount,
      label: 'رسالة',
      badge: stats?.unreadMessages ? stats.unreadMessages : undefined,
    },
    {
      href: '/gsg/orders',
      icon: ShoppingCart,
      title: 'الطلبات والمبيعات',
      desc: 'إدارة طلبات البطاقات',
      color: 'bg-purple-500',
      value: loading ? '...' : stats?.ordersCount,
      label: 'طلب',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">لوحة القيادة والمبيعات</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على أداء المركز والإحصائيات الحديثة</p>
      </div>

      {/* Stats Cards */}
      <div id="tour-dashboard-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : stats?.teachersCount}</div>
              <div className="text-gray-500 text-sm">أستاذ نشط</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : stats?.unreadMessages}</div>
              <div className="text-gray-500 text-sm">رسائل غير مقروءة</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : stats?.ordersCount}</div>
              <div className="text-gray-500 text-sm">إجمالي الطلبات</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : `${stats?.totalRevenue} د.أ`}</div>
              <div className="text-gray-500 text-sm">إجمالي المبيعات المؤكدة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div id="tour-dashboard-charts">
      {!loading && stats?.chartData && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              المبيعات خلال آخر 7 أيام
            </h2>
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} stroke="#9ca3af" />
                  <YAxis tick={{fontSize: 12}} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" name="الأرباح (د.أ)" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-500" />
              الطلبات خلال آخر 7 أيام
            </h2>
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} stroke="#9ca3af" />
                  <YAxis tick={{fontSize: 12}} stroke="#9ca3af" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f3f4f6'}}
                  />
                  <Legend />
                  <Bar name="عدد الطلبات" dataKey="orders" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Quick Actions */}
      <div id="tour-dashboard-quick" className="grid md:grid-cols-3 gap-6 mb-8">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
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
    </div>
  );
}
