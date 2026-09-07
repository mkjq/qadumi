import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get('admin');

  const cards = await prisma.courseCard.findMany({
    where: admin ? undefined : { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(cards);
}

export async function POST(request: Request) {
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
}
