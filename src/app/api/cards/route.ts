import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    const cards = await prisma.courseCard.findMany({
      where: admin ? undefined : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('[API cards GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const card = await prisma.courseCard.create({
      data: {
        title: body.title,
        subject: body.subject,
        grade: body.grade,
        teacherName: body.teacherName,
        price: parseFloat(body.price),
        imageUrl: body.imageUrl,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    console.error('[API cards POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create card' }, { status: 500 });
  }
}
