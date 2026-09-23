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
      level: 'أستاذ المركز',
      minPoints: 700,
      maxPoints: 1000,
      nextLevel: null,
      progressPercent: 100,
    };
  }
  if (points >= 300) {
    return {
      level: 'بطل المركز',
      minPoints: 300,
      maxPoints: 700,
      nextLevel: 'أستاذ المركز',
      progressPercent: Math.min(100, Math.round(((points - 300) / (700 - 300)) * 100)),
    };
  }
  if (points >= 100) {
    return {
      level: 'متقدم',
      minPoints: 100,
      maxPoints: 300,
      nextLevel: 'بطل المركز',
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

// Convert base64url to Uint8Array
function base64urlToUint8Array(base64url: string) {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Convert Uint8Array to base64url
function uint8ArrayToBase64url(uint8Array: Uint8Array) {
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getHmacKey() {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign a secure HMAC-SHA256 session token (Web Crypto API)
 */
export async function signStudentToken(payload: StudentPayload, expiresInDays: number = 30): Promise<string> {
  const header = uint8ArrayToBase64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload = uint8ArrayToBase64url(new TextEncoder().encode(JSON.stringify({ ...payload, exp })));
  const data = `${header}.${fullPayload}`;
  
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const signature = uint8ArrayToBase64url(new Uint8Array(signatureBuffer));
  
  return `${data}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 student token (Web Crypto API)
 */
export async function verifyStudentToken(token: string): Promise<StudentPayload | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;
    
    const key = await getHmacKey();
    const signatureUint8 = base64urlToUint8Array(signature);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureUint8,
      new TextEncoder().encode(data)
    );
    
    if (!isValid) return null;

    const parsedPayload = JSON.parse(new TextDecoder().decode(base64urlToUint8Array(payload)));
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
    const student = await verifyStudentToken(token);
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
      const student = await verifyStudentToken(token);
      if (student) return student;
    }
  }

  return null;
}
