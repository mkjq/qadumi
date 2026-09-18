import HeroSection from '@/components/home/HeroSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import SchoolBanner from '@/components/home/SchoolBanner';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let centerInfo: Record<string, string> = {};

  try {
    const rawInfo = await prisma.centerInfo.findMany();
    centerInfo = rawInfo.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  } catch (err) {
    console.error('[Home] Error loading centerInfo:', err);
  }

  return (
    <div className="flex flex-col bg-white overflow-hidden font-arabic">
      {/* 1. Hero Section */}
      <HeroSection centerInfo={centerInfo as any} />

      {/* 2. Compact Programs Horizontal Carousel */}
      <ProgramsSection />

      {/* 3. Distinctive Navy School Showcase Card (Jo Academy Style) */}
      <SchoolBanner />

      {/* 4. Center Achievements & Stats */}
      <StatsSection centerInfo={centerInfo as any} />

      {/* 5. About Story & Pillars */}
      <AboutSection centerInfo={centerInfo as any} />

      {/* 6. Student Reviews */}
      <ReviewsSection />

      {/* 7. Quick Contact */}
      <ContactSection centerInfo={centerInfo as any} />
    </div>
  );
}
