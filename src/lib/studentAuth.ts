import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'qadoumi-student-secret-2025-secure';

/**
 * Hash a plain password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Gamification prestige tier breakdown based on points
 */
export function getPrestigeTier(points: number) {
  if (points >= 700) {
    return {
      level: 'أسطورة القدومي',
      minPoints: 700,
      maxPoints: 1000,
      nextLevel: null,
      progressPercent: 100,
    };
  }
  if (points >= 300) {
    return {
      level: 'بطل القدومي',
      minPoints: 300,
      maxPoints: 700,
      nextLevel: 'أسطورة القدومي',
      progressPercent: Math.min(100, Math.round(((points - 300) / (700 - 300)) * 100)),
    };
  }
  if (points >= 100) {
    return {
      level: 'متقدم',
      minPoints: 100,
      maxPoints: 300,
      nextLevel: 'بطل القدومي',
      progressPercent: Math.min(100, Math.round(((points - 100) / (300 - 100)) * 100)),
    };
  }
  return {
    level: 'مبتدئ',
    minPoints: 0,
    maxPoints: 100,
    nextLevel: 'متقدم',
    progressPercent: Math.min(100, Math.round((points / 100) * 100)),
  };
}

export interface StudentPayload {
  studentId: number;
  name: string;
  phone: string;
  grade?: string;
}

/**
 * Sign a secure HMAC-SHA256 session token
 */
export function signStudentToken(payload: StudentPayload, expiresInDays: number = 30): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const data = `${header}.${fullPayload}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 student token
 */
export function verifyStudentToken(token: string): StudentPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    if (signature !== expectedSig) return null;

    const parsedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (parsedPayload.exp && parsedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return {
      studentId: parsedPayload.studentId,
      name: parsedPayload.name,
      phone: parsedPayload.phone,
      grade: parsedPayload.grade,
    };
  } catch {
    return null;
  }
}

/**
 * Extract authenticated student payload from incoming request (Authorization header or student_token cookie)
 */
export async function getStudentFromRequest(request: Request): Promise<StudentPayload | null> {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const student = verifyStudentToken(token);
    if (student) return student;
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    const token = cookies['student_token'] || cookies['student_session'];
    if (token) {
      const student = verifyStudentToken(token);
      if (student) return student;
    }
  }

  return null;
}
