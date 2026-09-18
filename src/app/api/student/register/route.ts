import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signStudentToken } from '@/lib/studentAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, grade, email } = body;

    // 1. Validate mandatory fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم الطالب كاملاً (حرفين على الأقل)' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 9) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم هاتف صالح' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام' },
        { status: 400 }
      );
    }

    if (!grade || typeof grade !== 'string' || !grade.trim()) {
      return NextResponse.json(
        { error: 'يرجى اختيار المرحلة أو الصف الدراسي' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanGrade = grade.trim();
    const cleanEmail = email && typeof email === 'string' && email.trim() ? email.trim() : null;

    // 2. Check for duplicate phone or email
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { username: cleanPhone },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول' },
        { status: 409 }
      );
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Atomic transaction to create Student, EnrolledGrade, PointTransaction, and User
    const WELCOME_BONUS = 20;

    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          name: cleanName,
          phone: cleanPhone,
          username: cleanPhone,
          email: cleanEmail,
          passwordHash,
          grade: cleanGrade,
          points: WELCOME_BONUS,
          level: 'مبتدئ',
        },
      });

      await tx.enrolledGrade.create({
        data: {
          studentId: student.id,
          grade: cleanGrade,
        },
      });

      await tx.pointTransaction.create({
        data: {
          studentId: student.id,
          amount: WELCOME_BONUS,
          type: 'WELCOME_BONUS',
          description: 'مكافأة الترحيب والانضمام لمركز القدومي (+20 نقطة)',
        },
      });

      // Compatible User record
      await tx.user.upsert({
        where: { username: cleanPhone },
        update: {
          name: cleanName,
          phone: cleanPhone,
          grade: cleanGrade,
          points: WELCOME_BONUS,
        },
        create: {
          name: cleanName,
          phone: cleanPhone,
          username: cleanPhone,
          email: cleanEmail,
          passwordHash,
          role: 'STUDENT',
          grade: cleanGrade,
          points: WELCOME_BONUS,
        },
      });

      return student;
    });

    // 5. Generate secure session token
    const token = signStudentToken({
      studentId: result.id,
      name: result.name,
      phone: result.phone || cleanPhone,
      grade: result.grade,
    });

    const response = NextResponse.json(
      {
        success: true,
        token,
        student: {
          id: result.id,
          name: result.name,
          phone: result.phone,
          grade: result.grade,
          points: result.points,
          level: result.level,
        },
      },
      { status: 201 }
    );

    // Set HTTP-only session cookie
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
    console.error('[API student/register] Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء تسجيل الحساب' },
      { status: 500 }
    );
  }
}
