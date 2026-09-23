import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('[API messages GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await prisma.contactMessage.create({
      data: {
        name: body.name,
        phone: body.phone || null,
        message: body.message,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error('[API messages POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send message' }, { status: 500 });
  }
}
