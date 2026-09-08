import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import TeachersSection from '@/components/home/TeachersSection';
import CoursesSection from '@/components/home/CoursesSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  const rawInfo = await prisma.centerInfo.findMany();
  const centerInfo = rawInfo.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});

  return (
    <>
      <HeroSection centerInfo={centerInfo as any} />
      <StatsSection centerInfo={centerInfo as any} />
      <AboutSection centerInfo={centerInfo as any} />
      <TeachersSection teachers={teachers} />
      <CoursesSection />
      <ReviewsSection />
      <ContactSection centerInfo={centerInfo as any} />
    </>
  );
}
