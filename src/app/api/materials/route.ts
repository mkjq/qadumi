import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get('admin');

  const materials = await prisma.material.findMany({
    where: admin ? undefined : { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(materials);
}

export async function POST(request: Request) {
  const body = await request.json();
  const material = await prisma.material.create({
    data: {
      title: body.title,
      subject: body.subject,
      grade: body.grade,
      teacherName: body.teacherName,
      fileUrl: body.fileUrl,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(material, { status: 201 });
}
