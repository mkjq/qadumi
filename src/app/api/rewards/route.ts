import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
    });

    return NextResponse.json({
      success: true,
      rewards,
    });
  } catch (error) {
    console.error('[API rewards GET] Error:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل قائمة المكافآت' },
      { status: 500 }
    );
  }
}
