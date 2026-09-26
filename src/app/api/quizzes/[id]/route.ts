import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

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
        { status: 400, headers: NO_CACHE_HEADERS }
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
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    // CRITICAL ANTI-CHEAT REQUIREMENT:
    // Omit `isCorrect` from options served to client to prevent client-side inspection.
    // Also omit pedagogical explanation until submission.
    // Shuffle options within each question, then shuffle the questions order
    const maskedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      points: q.points,
      order: q.order,
      options: shuffleArray(q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        order: opt.order,
      }))),
    }));

    // Shuffle the questions order for anti-cheat
    const shuffledQuestions = shuffleArray(maskedQuestions);

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
        questions: shuffledQuestions,
      },
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error(`[API /api/quizzes/${params.id}] Error:`, error);
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الاختبار' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
