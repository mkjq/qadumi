import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const updateData: any = {
    name: body.name,
    username: body.username,
    role: body.role,
    permissions: body.permissions,
    isActive: body.isActive,
  };

  if (body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 10);
  }

  try {
    const admin = await prisma.admin.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      select: { id: true, name: true, username: true, role: true, permissions: true, isActive: true },
    });
    return NextResponse.json(admin);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Prevent deleting the last super admin or oneself
  if (parseInt(params.id) === parseInt((session?.user as any)?.id)) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  await prisma.admin.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ success: true });
}
