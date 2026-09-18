import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/Providers';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'مركز القدومي الثقافي',
  description: 'مركز القدومي الثقافي - من أعرق المراكز التعليمية في المنطقة. يقدم دروسًا من الصف الأول حتى التوجيهي بجميع المواد. تأسس عام 2000م.',
  keywords: 'مركز القدومي, مركز دراسي, دروس خصوصية, عمان, الأردن, تعليم',
  icons: {
    icon: '/images/logos/logo-original-notext-white.jpg',
    apple: '/images/logos/logo-original-notext-white.jpg',
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
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic antialiased">
        <Providers>
          <NextTopLoader 
            color="#0ea5e9"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #0ea5e9,0 0 5px #0ea5e9"
            zIndex={1600}
            showAtBottom={false}
          />
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
