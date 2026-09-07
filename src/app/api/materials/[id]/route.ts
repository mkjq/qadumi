import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const material = await prisma.material.update({
    where: { id: parseInt(params.id) },
    data: {
      title: body.title,
      subject: body.subject,
      grade: body.grade,
      teacherName: body.teacherName,
      fileUrl: body.fileUrl,
      isActive: body.isActive,
    },
  });
  return NextResponse.json(material);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Used for incrementing download count
  const body = await request.json();
  if (body.action === 'download') {
    const material = await prisma.material.update({
      where: { id: parseInt(params.id) },
      data: { downloads: { increment: 1 } },
    });
    return NextResponse.json(material);
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.material.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ success: true });
}
