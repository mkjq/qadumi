import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const orders = await prisma.order.findMany({
    include: { courseCard: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
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
}
