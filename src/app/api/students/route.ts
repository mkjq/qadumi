import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح: يجب تسجيل الدخول كمسؤول' }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        gender: true,
        grade: true,
        points: true,
        level: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { points: 'desc' },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('[API students GET] Error:', error);
    return NextResponse.json({ error: 'فشل في تحميل بيانات الطلاب' }, { status: 500 });
  }
}
