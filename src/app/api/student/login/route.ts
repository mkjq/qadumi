import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signStudentToken, getPrestigeTier } from '@/lib/studentAuth';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || typeof phone !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');

    // Lookup student by phone or username
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { username: cleanPhone },
        ],
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    if (!student.isActive) {
      return NextResponse.json(
        { error: 'تم تعطيل هذا الحساب. يرجى التواصل مع إدارة المركز' },
        { status: 403 }
      );
    }

    const isPasswordValid = await verifyPassword(password, student.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const tier = getPrestigeTier(student.points);

    // Update level if it changed
    if (student.level !== tier.level) {
      await prisma.student.update({
        where: { id: student.id },
        data: { level: tier.level },
      });
    }

    // 4. Generate secure session token
    const token = await signStudentToken({
      studentId: student.id,
      name: student.name,
      phone: student.phone || '',
      grade: student.grade || '',
    });

    const response = NextResponse.json({
      success: true,
      token,
      student: {
        id: student.id,
        name: student.name,
        phone: student.phone,
        points: student.points,
        grade: student.grade,
        level: tier.level,
      },
    });

    response.cookies.set({
      name: 'student_token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('[API student/login] Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
