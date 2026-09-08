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
  let teachers: any[] = [];
  let centerInfo: Record<string, string> = {};

  try {
    teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.error('[Home] Error loading teachers:', err);
  }

  try {
    const rawInfo = await prisma.centerInfo.findMany();
    centerInfo = rawInfo.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  } catch (err) {
    console.error('[Home] Error loading centerInfo:', err);
  }

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
