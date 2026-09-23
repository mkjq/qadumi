import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح: يجب تسجيل الدخول كمسؤول' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'معرف الطالب غير صالح' }, { status: 400 });
    }

    const body = await request.json();

    const updateData: any = {};
    if (body.points !== undefined) {
      const parsedPoints = parseInt(body.points, 10);
      updateData.points = isNaN(parsedPoints) ? 0 : Math.max(0, parsedPoints);
    }
    if (body.level !== undefined) updateData.level = body.level;
    if (body.grade !== undefined) updateData.grade = body.grade;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        grade: true,
        points: true,
        level: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error('[API students PUT] Error:', error);
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح: يجب تسجيل الدخول كمسؤول' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'معرف الطالب غير صالح' }, { status: 400 });
    }

    await prisma.student.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API students DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Delete failed' }, { status: 500 });
  }
}
