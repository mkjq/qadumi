import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id, 10);
    if (isNaN(quizId)) {
      return NextResponse.json(
        { error: 'معرف الاختبار غير صالح' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!quiz || !quiz.isActive) {
      return NextResponse.json(
        { error: 'الاختبار غير موجود' },
        { status: 404 }
      );
    }

    // CRITICAL ANTI-CHEAT REQUIREMENT:
    // Omit `isCorrect` from options served to client to prevent client-side inspection.
    // Also omit pedagogical explanation until submission.
    const maskedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      points: q.points,
      order: q.order,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        order: opt.order,
      })),
    }));

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        grade: quiz.grade,
        durationMinutes: quiz.durationMinutes,
        pointsPerCorrect: quiz.pointsPerCorrect,
        bonusPoints: quiz.bonusPoints,
        passingScore: quiz.passingScore,
        questionCount: quiz.questions.length,
        questions: maskedQuestions,
      },
    });
  } catch (error) {
    console.error(`[API /api/quizzes/${params.id}] Error:`, error);
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الاختبار' },
      { status: 500 }
    );
  }
}
