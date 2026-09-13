import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // We only care about /api routes for this middleware
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Authentication endpoints must always be public
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Rules defining which HTTP methods need admin authentication
  const rules = [
    { path: '/api/orders', protectedMethods: ['GET', 'PUT', 'DELETE', 'PATCH'] },
    { path: '/api/messages', protectedMethods: ['GET', 'PUT', 'DELETE', 'PATCH'] },
    { path: '/api/reviews', protectedMethods: ['PUT', 'DELETE', 'PATCH'] }, // POST is public for students leaving reviews, GET is public
    { path: '/api/teachers', protectedMethods: ['POST', 'PUT', 'DELETE', 'PATCH'] },
    { path: '/api/cards', protectedMethods: ['POST', 'PUT', 'DELETE', 'PATCH'] },
    { path: '/api/materials', protectedMethods: ['POST', 'PUT', 'DELETE', 'PATCH'] },
    { path: '/api/center', protectedMethods: ['POST', 'PUT', 'DELETE', 'PATCH'] },
    { path: '/api/admins', protectedMethods: ['*'] },
    { path: '/api/upload', protectedMethods: ['*'] },
    { path: '/api/upload-doc', protectedMethods: ['*'] },
  ];

  let isProtected = false;

  for (const rule of rules) {
    if (pathname.startsWith(rule.path)) {
      if (rule.protectedMethods.includes('*') || rule.protectedMethods.includes(method)) {
        isProtected = true;
        break;
      }
    }
  }

  // Also protect GET requests that explicitly ask for admin-only data
  if (method === 'GET' && request.nextUrl.searchParams.has('admin')) {
    isProtected = true;
  }

  if (isProtected) {
    // Verify the JWT token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in as an admin to perform this action.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
