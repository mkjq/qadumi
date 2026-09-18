'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getRewards() {
  return await prisma.reward.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteReward(id: number) {
  await prisma.reward.delete({ where: { id } });
  revalidatePath('/admin/rewards');
}

export async function saveReward(data: any) {
  if (data.id) {
    await prisma.reward.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        pointsCost: parseInt(data.pointsCost),
        icon: data.icon,
        isActive: data.isActive
      }
    });
  } else {
    await prisma.reward.create({
      data: {
        title: data.title,
        description: data.description,
        pointsCost: parseInt(data.pointsCost),
        icon: data.icon,
        isActive: data.isActive ?? true
      }
    });
  }
  revalidatePath('/admin/rewards');
}
