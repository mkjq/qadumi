'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getStudents() {
  return await prisma.student.findMany({
    orderBy: { points: 'desc' }
  });
}

export async function saveStudent(data: any) {
  if (data.id) {
    await prisma.student.update({
      where: { id: data.id },
      data: {
        points: parseInt(data.points),
        level: data.level,
        grade: data.grade,
        isActive: data.isActive
      }
    });
  }
  revalidatePath('/gsg/students');
}

export async function deleteStudent(id: number) {
  await prisma.student.delete({ where: { id } });
  revalidatePath('/gsg/students');
}
