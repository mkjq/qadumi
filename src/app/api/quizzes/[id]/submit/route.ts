import { NextResponse } from 'next/server';

import { getStudentFromRequest, getPrestigeTier } from '@/lib/studentAuth';

import { prisma } from '@/lib/db';

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

    // 1. Authenticate student session strictly (eliminate unauthenticated fallback)
    const session = await getStudentFromRequest(request);
    if (!session || !session.studentId) {
      return NextResponse.json(
        { error: 'غير مصرح: يرجى تسجيل الدخول' },
        { status: 401 }
      );
    }

    // Reject IDOR attempts if body.studentId is explicitly passed and conflicts with session
    if (body.studentId !== undefined && body.studentId !== null) {
      const explicitId = Number(body.studentId);
      if (!isNaN(explicitId) && explicitId !== session.studentId) {
        return NextResponse.json(
          { error: 'غير مصرح: لا يمكنك تقديم اختبار لطالب آخر' },
          { status: 403 }
        );
      }
    }

    const targetStudentId = session.studentId;

    const student = await prisma.student.findUnique({
      where: { id: targetStudentId },
    });

    if (!student || !student.isActive) {
      return NextResponse.json(
        { error: 'الاختبار أو الطالب غير موجود' },
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
        { error: 'الاختبار أو الطالب غير موجود' },
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

    // 4. Concurrency-Safe Transaction with In-Transaction Verification
    const submissionResult = await prisma.$transaction(async (tx) => {
      // Serialize concurrent submissions for this student to eliminate TOCTOU race conditions
      // Removed explicit FOR UPDATE lock because it throws errors on Prisma Edge clients/Neon poolers

      // Check for previous submissions inside transaction
      const previousSubmission = await tx.quizSubmission.findFirst({
        where: {
          quizId: quiz.id,
          studentId: student.id,
        },
      });
      const isFirstAttempt = !previousSubmission;
      const actualPointsEarned = isFirstAttempt ? pointsEarned : 0;

      const sub = await tx.quizSubmission.create({
        data: {
          quizId: quiz.id,
          studentId: student.id,
          score: scorePercentage,
          totalQuestions,
          correctAnswers,
          pointsEarned: actualPointsEarned,
          answersJson: JSON.stringify(answers),
        },
      });

      let updatedStudent = student;
      let updatedTier = getPrestigeTier(student.points);

      if (actualPointsEarned > 0) {
        await tx.pointTransaction.create({
          data: {
            studentId: student.id,
            amount: actualPointsEarned,
            type: 'QUIZ_REWARD',
            description: `مكافأة اختبار ${quiz.title} (+${actualPointsEarned} نقطة)`,
          },
        });

        updatedStudent = await tx.student.update({
          where: { id: student.id },
          data: {
            points: { increment: actualPointsEarned },
          },
        });

        updatedTier = getPrestigeTier(updatedStudent.points);
        if (updatedStudent.level !== updatedTier.level) {
          updatedStudent = await tx.student.update({
            where: { id: student.id },
            data: { level: updatedTier.level },
          });
        }
      } else {
        const freshStudent = await tx.student.findUnique({
          where: { id: student.id },
        });
        if (freshStudent) {
          updatedStudent = freshStudent;
          updatedTier = getPrestigeTier(freshStudent.points);
        }
      }

      return { sub, updatedStudent, updatedTier, isFirstAttempt, actualPointsEarned };
    });

    return NextResponse.json({
      success: true,
      submissionId: submissionResult.sub.id,
      score: scorePercentage,
      correctAnswers,
      totalQuestions,
      pointsEarned: submissionResult.actualPointsEarned,
      isFirstAttempt: submissionResult.isFirstAttempt,
      newTotalPoints: submissionResult.updatedStudent.points,
      level: submissionResult.updatedTier.level,
      review,
    });
  } catch (error) {
    console.error(`[API /api/quizzes/${params.id}/submit] Error:`, error);
    return NextResponse.json(
      { error: 'حدث خطأ داخلي في الخادم أثناء تقديم الاختبار' },
        { status: 500 }
    );
  }
}

