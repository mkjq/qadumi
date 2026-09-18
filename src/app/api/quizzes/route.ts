import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (grade && grade.trim() !== '' && grade !== 'ALL') {
      where.grade = grade.trim();
    }

    if (subject && subject.trim() !== '' && subject !== 'ALL') {
      where.subject = subject.trim();
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedQuizzes = quizzes.map((q) => {
      const questionCount = q.questions.length;
      const pointsReward = questionCount * q.pointsPerCorrect + q.bonusPoints;

      return {
        id: q.id,
        title: q.title,
        description: q.description,
        subject: q.subject,
        grade: q.grade,
        durationMinutes: q.durationMinutes,
        pointsReward,
        pointsPerCorrect: q.pointsPerCorrect,
        bonusPoints: q.bonusPoints,
        passingScore: q.passingScore,
        questionCount,
      };
    });

    return NextResponse.json({
      success: true,
      quizzes: formattedQuizzes,
    });
  } catch (error) {
    console.error('[API /api/quizzes] Error:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل قائمة الاختبارات' },
      { status: 500 }
    );
  }
}
