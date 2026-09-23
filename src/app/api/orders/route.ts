import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: { courseCard: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[API orders GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        courseCardId: parseInt(body.courseCardId),
        paymentMethod: body.paymentMethod,
        receiptUrl: body.receiptUrl,
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('[API orders POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 });
  }
}
