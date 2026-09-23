import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    
    const teachers = await prisma.teacher.findMany({
      where: admin ? undefined : { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('[API teachers GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teacher = await prisma.teacher.create({ data: body });
    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.error('[API teachers POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create teacher' }, { status: 500 });
  }
}
