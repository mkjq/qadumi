import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const order = await prisma.order.update({
    where: { id: parseInt(params.id) },
    data: { status: body.status },
  });
  return NextResponse.json(order);
}
