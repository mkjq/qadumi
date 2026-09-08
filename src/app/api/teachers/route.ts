import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(teachers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teacher = await prisma.teacher.create({ data: body });
    revalidatePath('/', 'layout');
    return NextResponse.json(teacher, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}
