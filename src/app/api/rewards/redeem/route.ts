import { NextResponse } from 'next/server';
import { getStudentFromRequest } from '@/lib/studentAuth';

import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    let body: Record<string, any> = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const { rewardId, studentId: explicitStudentId } = body;

    // 1. Require authenticated student session (eliminate IDOR)
    const session = await getStudentFromRequest(request);
    if (!session || !session.studentId) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول لاستبدال النقاط' },
        { status: 401 }
      );
    }

    // 2. Reject IDOR if body.studentId is provided and does not match session
    if (explicitStudentId !== undefined && explicitStudentId !== null) {
      const parsedExplicit = Number(explicitStudentId);
      if (!isNaN(parsedExplicit) && parsedExplicit !== session.studentId) {
        return NextResponse.json(
          { error: 'غير مصرح: لا يمكنك استبدال مكافأة لحساب طالب آخر' },
          { status: 403 }
        );
      }
    }

    const targetStudentId = session.studentId;

    if (!rewardId || typeof rewardId !== 'number') {
      return NextResponse.json(
        { error: 'يرجى تحديد المكافأة المطلوب استبدالها' },
        { status: 400 }
      );
    }

    // Find reward
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isActive) {
      return NextResponse.json(
        { error: 'المكافأة المحددة غير متوفرة حالياً' },
        { status: 404 }
      );
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { id: targetStudentId },
    });

    if (!student || !student.isActive) {
      return NextResponse.json(
        { error: 'حساب الطالب غير موجود أو معطل' },
        { status: 404 }
      );
    }

    if (student.points < reward.pointsCost) {
      return NextResponse.json(
        {
          error: `رصيدك الحالي (${student.points} نقطة) غير كافٍ. تحتاج إلى ${reward.pointsCost} نقطة لاستبدال هذه المكافأة.`,
          requiredPoints: reward.pointsCost,
          currentPoints: student.points,
        },
        { status: 400 }
      );
    }

    // Atomic transaction for point deduction, transaction record, and redemption log
    const result = await prisma.$transaction(async (tx) => {
      // Serialize concurrent redemptions for this student to eliminate double-spend race condition
      await tx.$executeRaw`SELECT 1 FROM "Student" WHERE id = ${targetStudentId} FOR UPDATE`;

      const currentStudent = await tx.student.findUnique({
        where: { id: targetStudentId },
      });

      if (!currentStudent || currentStudent.points < reward.pointsCost) {
        throw new Error('INSUFFICIENT_POINTS');
      }

      const updatedStudent = await tx.student.update({
        where: { id: targetStudentId },
        data: {
          points: { decrement: reward.pointsCost },
        },
      });

      const pointTx = await tx.pointTransaction.create({
        data: {
          studentId: targetStudentId,
          amount: -reward.pointsCost,
          type: 'REWARD_REDEMPTION',
          description: `استبدال مكافأة: ${reward.title} (-${reward.pointsCost} نقطة)`,
        },
      });

      const redemption = await tx.rewardRedemption.create({
        data: {
          studentId: targetStudentId,
          rewardId: reward.id,
          pointsSpent: reward.pointsCost,
          status: 'COMPLETED',
        },
      });

      return { updatedStudent, pointTx, redemption };
    });

    return NextResponse.json({
      success: true,
      message: `مبروك! تم استبدال مكافأة "${reward.title}" بنجاح!`,
      pointsSpent: reward.pointsCost,
      newPointsBalance: result.updatedStudent.points,
      redemptionId: result.redemption.id,
    });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'INSUFFICIENT_POINTS') {
      return NextResponse.json(
        { error: 'رصيدك الحالي غير كافٍ لاستبدال هذه المكافأة' },
        { status: 400 }
      );
    }
    console.error('[API rewards/redeem POST] Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء استبدال المكافأة' },
      { status: 500 }
    );
  }
}

