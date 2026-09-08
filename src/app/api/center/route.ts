import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const info = await prisma.centerInfo.findMany();
  return NextResponse.json(Object.fromEntries(info.map((i) => [i.key, i.value])));
}

export async function PUT(request: Request) {
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
  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true, updated: updates.length });
}
