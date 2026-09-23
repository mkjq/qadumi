import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const material = await prisma.material.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        subject: body.subject,
        grade: body.grade,
        branch: body.branch,
        teacherName: body.teacherName,
        googleDriveLink: body.googleDriveLink,
        coverImage: body.coverImage,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(material);
  } catch (error: any) {
    console.error('[API materials PUT] Error:', error);
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (body.action === 'download') {
      const material = await prisma.material.update({
        where: { id: parseInt(params.id) },
        data: { downloads: { increment: 1 } },
      });
      return NextResponse.json(material);
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[API materials PATCH] Error:', error);
    return NextResponse.json({ error: error?.message || 'Patch failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.material.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API materials DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Delete failed' }, { status: 500 });
  }
}
