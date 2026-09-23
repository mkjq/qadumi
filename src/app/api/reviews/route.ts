import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    const reviews = await prisma.review.findMany({
      where: admin ? undefined : { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[API reviews GET] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = await prisma.review.create({
      data: {
        name: body.name,
        userType: body.userType || 'طالب',
        content: body.content,
        rating: body.rating || 5,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('[API reviews POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create review' }, { status: 500 });
  }
}
