import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'مركز القدومي الثقافي',
  description: 'مركز القدومي الثقافي - من أعرق المراكز التعليمية في المنطقة. يقدم دروسًا من الصف الأول حتى التوجيهي بجميع المواد. تأسس عام 2000م.',
  keywords: 'مركز القدومي, مركز دراسي, دروس خصوصية, عمان, الأردن, تعليم',
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  openGraph: {
    title: 'مركز القدومي الثقافي',
    description: 'من أعرق المراكز التعليمية في المنطقة - تأسس عام 2000م',
    locale: 'ar_JO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: 'Cairo, sans-serif',
                direction: 'rtl',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
