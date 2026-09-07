import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, username: true, role: true, permissions: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(admins);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const passwordHash = await bcrypt.hash(body.password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        name: body.name,
        username: body.username,
        passwordHash,
        role: body.role || 'ADMIN',
        permissions: body.permissions || '',
        isActive: body.isActive ?? true,
      },
      select: { id: true, name: true, username: true, role: true, permissions: true, isActive: true },
    });
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Username may already exist' }, { status: 400 });
  }
}
