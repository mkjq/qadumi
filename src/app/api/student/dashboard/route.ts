import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStudentFromRequest, getPrestigeTier } from '@/lib/studentAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryStudentId = searchParams.get('studentId');

    let targetStudentId: number | null = null;

    if (queryStudentId) {
      targetStudentId = parseInt(queryStudentId, 10);
    } else {
      const session = await getStudentFromRequest(request);
      if (session) {
        targetStudentId = session.studentId;
      }
    }

    if (!targetStudentId || isNaN(targetStudentId)) {
      return NextResponse.json(
        { error: 'غير مصرح: يرجى تسجيل الدخول لعرض لوحة التحكم' },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: targetStudentId },
      include: {
        enrolledGrades: true,
        pointTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 15,
        },
        quizSubmissions: {
          include: {
            quiz: {
              select: {
                title: true,
                subject: true,
              },
            },
          },
          orderBy: { completedAt: 'desc' },
          take: 15,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'لم يتم العثور على حساب الطالب' },
        { status: 404 }
      );
    }

    const tier = getPrestigeTier(student.points);

    // Compute stats
    const quizzesCompleted = student.quizSubmissions.length;
    const averageScore =
      quizzesCompleted > 0
        ? Math.round(
            student.quizSubmissions.reduce((acc, sub) => acc + sub.score, 0) / quizzesCompleted
          )
        : 0;

    // Total positive points earned across history
    const allPositiveTx = await prisma.pointTransaction.findMany({
      where: {
        studentId: targetStudentId,
        amount: { gt: 0 },
      },
      select: { amount: true },
    });
    const totalPointsEarned = allPositiveTx.reduce((acc, tx) => acc + tx.amount, 0);

    const recentTransactions = student.pointTransactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
    }));

    const recentSubmissions = student.quizSubmissions.map((sub) => ({
      id: sub.id,
      quizTitle: sub.quiz?.title || 'اختبار تقييمي',
      subject: sub.quiz?.subject || 'عام',
      score: sub.score,
      totalQuestions: sub.totalQuestions,
      correctAnswers: sub.correctAnswers,
      pointsEarned: sub.pointsEarned,
      completedAt: sub.completedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        phone: student.phone,
        email: student.email,
        grade: student.grade,
        points: student.points,
        level: tier.level,
        prestige: tier,
        avatar: student.avatar,
        enrolledGrades: student.enrolledGrades,
      },
      stats: {
        quizzesCompleted,
        averageScore,
        totalPointsEarned: Math.max(totalPointsEarned, student.points),
      },
      recentTransactions,
      recentSubmissions,
    });
  } catch (error) {
    console.error('[API student/dashboard] Error:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل بيانات لوحة التحكم' },
      { status: 500 }
    );
  }
}
