import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(teacher);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await request.json();
  
  // Sanitize input to prevent updating restricted fields like id or createdAt
  const { name, subject, grades, phone, whatsapp, facebook, instagram, bio, image, order, isActive } = body;
  const data = { name, subject, grades, phone, whatsapp, facebook, instagram, bio, image, order, isActive };

  try {
    const teacher = await prisma.teacher.update({ where: { id }, data });
    revalidatePath('/', 'layout');
    return NextResponse.json(teacher);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  try {
    await prisma.teacher.delete({ where: { id } });
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
