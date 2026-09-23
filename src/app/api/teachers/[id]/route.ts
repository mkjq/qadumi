import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(teacher);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch teacher' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const { name, subject, grades, phone, whatsapp, facebook, instagram, bio, image, imagePosition, order, isActive } = body;
    const data = { name, subject, grades, phone, whatsapp, facebook, instagram, bio, image, imagePosition, order, isActive };

    const teacher = await prisma.teacher.update({ where: { id }, data });
    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error('[API teachers PUT] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.teacher.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API teachers DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete' }, { status: 500 });
  }
}
