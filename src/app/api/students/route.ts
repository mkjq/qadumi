import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { points: 'desc' },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('[API students GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
