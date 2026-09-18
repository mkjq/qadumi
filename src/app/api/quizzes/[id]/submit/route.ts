import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStudentFromRequest, getPrestigeTier } from '@/lib/studentAuth';

export const dynamic = 'force-dynamic';

export async function POST(
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

    let body: Record<string, any> = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    // 1. Resolve student identity
    let targetStudentId: number | null = null;
    const session = await getStudentFromRequest(request);

    if (session && session.studentId) {
      targetStudentId = session.studentId;
    } else if (body.studentId !== undefined && body.studentId !== null) {
      const parsedId = Number(body.studentId);
      if (!isNaN(parsedId)) {
        targetStudentId = parsedId;
      }
    }

    if (!targetStudentId) {
      return NextResponse.json(
        { error: 'غير مصرح: يرجى تسجيل الدخول أو تقديم معرف الطالب' },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: targetStudentId },
    });

    if (!student || !student.isActive) {
      return NextResponse.json(
        { error: 'حساب الطالب غير موجود أو غير نشط' },
        { status: 404 }
      );
    }

    // 2. Fetch quiz with questions and correct options
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

    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;
    const review: Array<{
      questionId: number;
      questionText: string;
      selectedOptionId: number | null;
      correctOptionId: number | null;
      isCorrect: boolean;
      explanation: string | null;
    }> = [];

    // 3. Score calculation
    for (const q of quiz.questions) {
      const correctOpt = q.options.find((opt) => opt.isCorrect);
      const rawSelected = answers[q.id] ?? answers[String(q.id)];
      const selectedOptionId = rawSelected !== undefined && rawSelected !== null ? Number(rawSelected) : null;
      const isCorrect = selectedOptionId !== null && correctOpt !== undefined && selectedOptionId === correctOpt.id;

      if (isCorrect) {
        correctAnswers++;
      }

      review.push({
        questionId: q.id,
        questionText: q.question,
        selectedOptionId,
        correctOptionId: correctOpt ? correctOpt.id : null,
        isCorrect: Boolean(isCorrect),
        explanation: q.explanation || null,
      });
    }

    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const pointsPerCorrect = quiz.pointsPerCorrect || 10;
    const bonus = scorePercentage >= (quiz.passingScore || 60) ? (quiz.bonusPoints || 20) : 0;
    const pointsEarned = (correctAnswers * pointsPerCorrect) + (correctAnswers > 0 ? bonus : 0);

    // 4. Atomic database transaction
    const submissionResult = await prisma.$transaction(async (tx) => {
      const sub = await tx.quizSubmission.create({
        data: {
          quizId: quiz.id,
          studentId: student.id,
          score: scorePercentage,
          totalQuestions,
          correctAnswers,
          pointsEarned,
          answersJson: JSON.stringify(answers),
        },
      });

      if (pointsEarned > 0) {
        await tx.pointTransaction.create({
          data: {
            studentId: student.id,
            amount: pointsEarned,
            type: 'QUIZ_REWARD',
            description: `إكمال اختبار ${quiz.title} بنجاح (+${pointsEarned} نقطة)`,
          },
        });
      }

      const updatedStudent = await tx.student.update({
        where: { id: student.id },
        data: {
          points: { increment: pointsEarned },
        },
      });

      const updatedTier = getPrestigeTier(updatedStudent.points);
      if (updatedStudent.level !== updatedTier.level) {
        await tx.student.update({
          where: { id: student.id },
          data: { level: updatedTier.level },
        });
      }

      return { sub, updatedStudent, updatedTier };
    });

    return NextResponse.json({
      success: true,
      submissionId: submissionResult.sub.id,
      score: scorePercentage,
      correctAnswers,
      totalQuestions,
      pointsEarned,
      newTotalPoints: submissionResult.updatedStudent.points,
      level: submissionResult.updatedTier.level,
      review,
    });
  } catch (error) {
    console.error(`[API /api/quizzes/${params.id}/submit] Error:`, error);
    return NextResponse.json(
      { error: 'فشل في حفظ وإرسال إجابات الاختبار' },
      { status: 500 }
    );
  }
}
