import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStudentFromRequest, getPrestigeTier } from '@/lib/studentAuth';

export async function GET(request: Request) {
  try {
    const session = await getStudentFromRequest(request);

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    const student = await prisma.student.findUnique({
      where: { id: session.studentId },
      include: {
        enrolledGrades: {
          select: {
            id: true,
            grade: true,
            subject: true,
            enrolledAt: true,
          },
        },
      },
    });

    if (!student || !student.isActive) {
      return NextResponse.json({ authenticated: false });
    }

    const tier = getPrestigeTier(student.points);

    return NextResponse.json({
      authenticated: true,
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
    });
  } catch (error) {
    console.error('[API student/me] Error:', error);
    return NextResponse.json({ authenticated: false, error: 'Failed to verify session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Logout endpoint: Clear session cookie
  try {
    const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
    response.cookies.set({
      name: 'student_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
