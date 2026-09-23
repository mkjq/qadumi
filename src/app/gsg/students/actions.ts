'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function assertAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized: Admin session required');
  }
  return session;
}

export async function getStudents() {
  await assertAdminSession();
  return await prisma.student.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      phone: true,
      email: true,
      gender: true,
      grade: true,
      points: true,
      level: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { points: 'desc' }
  });
}

export async function saveStudent(data: any) {
  await assertAdminSession();
  if (data.id) {
    await prisma.student.update({
      where: { id: data.id },
      data: {
        points: Math.max(0, parseInt(data.points) || 0),
        level: data.level,
        grade: data.grade,
        isActive: data.isActive
      }
    });
  }
  revalidatePath('/gsg/students');
}

export async function deleteStudent(id: number) {
  await assertAdminSession();
  await prisma.student.delete({ where: { id } });
  revalidatePath('/gsg/students');
}
