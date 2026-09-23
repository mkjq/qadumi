import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: parseInt(params.id) },
      data: { status: body.status },
    });
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('[API orders PATCH] Error:', error);
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
  }
}
