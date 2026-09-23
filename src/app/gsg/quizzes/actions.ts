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

export async function deleteQuiz(id: number) {
  await assertAdminSession();
  await prisma.quiz.delete({ where: { id } });
  revalidatePath('/gsg/quizzes');
  revalidatePath('/quizzes');
}

export async function getQuizzes() {
  await assertAdminSession();
  return await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      questions: {
        include: { options: true }
      }
    }
  });
}

export async function saveQuiz(data: any) {
  await assertAdminSession();
  if (data.id) {
    // Delete existing questions and recreate them to simplify update
    await prisma.quizQuestion.deleteMany({ where: { quizId: data.id } });
    
    await prisma.quiz.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        grade: data.grade,
        durationMinutes: parseInt(data.durationMinutes),
        pointsPerCorrect: parseInt(data.pointsPerCorrect),
        bonusPoints: parseInt(data.bonusPoints),
        passingScore: parseInt(data.passingScore),
        isActive: data.isActive,
        questions: {
          create: data.questions.map((q: any, qIdx: number) => ({
            question: q.question,
            order: qIdx,
            points: parseInt(data.pointsPerCorrect),
            options: {
              create: q.options.map((opt: any, oIdx: number) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: oIdx
              }))
            }
          }))
        }
      }
    });
  } else {
    await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        grade: data.grade,
        durationMinutes: parseInt(data.durationMinutes),
        pointsPerCorrect: parseInt(data.pointsPerCorrect),
        bonusPoints: parseInt(data.bonusPoints),
        passingScore: parseInt(data.passingScore),
        isActive: data.isActive ?? true,
        questions: {
          create: data.questions.map((q: any, qIdx: number) => ({
            question: q.question,
            order: qIdx,
            points: parseInt(data.pointsPerCorrect),
            options: {
              create: q.options.map((opt: any, oIdx: number) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: oIdx
              }))
            }
          }))
        }
      }
    });
  }

  revalidatePath('/gsg/quizzes');
  revalidatePath('/quizzes');
}
