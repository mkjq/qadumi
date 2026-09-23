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

export async function getRewards() {
  await assertAdminSession();
  return await prisma.reward.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteReward(id: number) {
  await assertAdminSession();
  await prisma.reward.delete({ where: { id } });
  revalidatePath('/gsg/rewards');
}

export async function saveReward(data: any) {
  await assertAdminSession();
  if (data.id) {
    await prisma.reward.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        pointsCost: Math.max(0, parseInt(data.pointsCost) || 0),
        icon: data.icon,
        isActive: data.isActive
      }
    });
  } else {
    await prisma.reward.create({
      data: {
        title: data.title,
        description: data.description,
        pointsCost: Math.max(0, parseInt(data.pointsCost) || 0),
        icon: data.icon,
        isActive: data.isActive ?? true
      }
    });
  }
  revalidatePath('/gsg/rewards');
}
