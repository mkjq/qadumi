import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  return NextResponse.json(message);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
