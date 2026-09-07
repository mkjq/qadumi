import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const message = await prisma.contactMessage.create({
    data: {
      name: body.name,
      phone: body.phone || null,
      message: body.message,
    },
  });
  return NextResponse.json(message, { status: 201 });
}
