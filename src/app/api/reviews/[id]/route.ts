import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const review = await prisma.review.update({
      where: { id: parseInt(params.id) },
      data: { isApproved: body.isApproved },
    });
    return NextResponse.json(review);
  } catch (error: any) {
    console.error('[API reviews PATCH] Error:', error);
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.review.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API reviews DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Delete failed' }, { status: 500 });
  }
}
