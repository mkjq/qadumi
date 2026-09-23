import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const info = await prisma.centerInfo.findMany();
    return NextResponse.json(Object.fromEntries(info.map((i) => [i.key, i.value])));
  } catch (error) {
    console.error('[API center GET] Error:', error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.centerInfo.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );
    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error: any) {
    console.error('[API center PUT] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update center settings' }, { status: 500 });
  }
}
