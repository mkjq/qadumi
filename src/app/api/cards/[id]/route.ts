import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const card = await prisma.courseCard.update({
    where: { id: parseInt(params.id) },
    data: {
      title: body.title,
      subject: body.subject,
      grade: body.grade,
      teacherName: body.teacherName,
      price: parseFloat(body.price),
      imageUrl: body.imageUrl,
      isActive: body.isActive,
    },
  });
  return NextResponse.json(card);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.courseCard.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ success: true });
}
