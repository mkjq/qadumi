import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    const materials = await prisma.material.findMany({
      where: admin ? undefined : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error('[API materials GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const material = await prisma.material.create({
      data: {
        title: body.title,
        subject: body.subject,
        grade: body.grade,
        branch: body.branch,
        teacherName: body.teacherName,
        googleDriveLink: body.googleDriveLink,
        coverImage: body.coverImage,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(material, { status: 201 });
  } catch (error: any) {
    console.error('[API materials POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create material' }, { status: 500 });
  }
}
