import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get('admin');

  // If admin requests, fetch all reviews. Otherwise, only approved ones.
  const reviews = await prisma.review.findMany({
    where: admin ? undefined : { isApproved: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
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
}
