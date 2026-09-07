'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Star,
  FileText,
  Shield,
  CreditCard,
  ShoppingCart,
  UserCog,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
  { href: '/admin/teachers', label: 'إدارة الأساتذة', icon: Users, perm: 'TEACHERS' },
  { href: '/admin/cards', label: 'متجر البطاقات', icon: CreditCard, perm: 'CARDS' },
  { href: '/admin/orders', label: 'الطلبات والمبيعات', icon: ShoppingCart, perm: 'ORDERS' },
  { href: '/admin/materials', label: 'الدوسيات والملفات', icon: FileText, perm: 'MATERIALS' },
  { href: '/admin/messages', label: 'الرسائل', icon: MessageSquare, perm: 'MESSAGES' },
  { href: '/admin/reviews', label: 'التقييمات', icon: Star, perm: 'REVIEWS' },
  { href: '/admin/settings', label: 'إعدادات المركز', icon: Settings, perm: 'SETTINGS' },
  { href: '/admin/users', label: 'المشرفين والصلاحيات', icon: UserCog, perm: 'USERS', superAdminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (status === 'loading') return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-primary-900 text-white transform transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-primary-700">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-xl p-1">
                <Image
                  src="/logo.jpeg"
                  alt="مركز القدومي"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">مركز القدومي الثقافي</div>
                <div className="text-gold-400 text-xs mt-0.5">لوحة التحكم</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.filter(item => {
              const userRole = (session.user as any)?.role;
              const userPerms = (session.user as any)?.permissions || '';
              
              // If legacy session (no role), assume SUPER_ADMIN for the main admin user
              if (!userRole || userRole === 'SUPER_ADMIN') return true;
              if (item.superAdminOnly) return false;
              if (item.perm && !userPerms.includes(item.perm) && userPerms !== 'ALL') return false;
              
              return true;
            }).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-primary-700">
            <div className="text-white/60 text-xs mb-3 px-2">مسجل كـ: {session.user?.name}</div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm mb-1"
            >
              <span>🌐</span>
              <span>عرض الموقع</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 md:mr-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold text-xs">
                {session.user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:block">{session.user?.name}</span>
          </div>
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
