import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const review = await prisma.review.update({
    where: { id: parseInt(params.id) },
    data: { isApproved: body.isApproved },
  });
  revalidatePath('/', 'layout');
  return NextResponse.json(review);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.review.delete({
    where: { id: parseInt(params.id) },
  });
  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}
