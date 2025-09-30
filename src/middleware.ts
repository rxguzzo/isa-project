// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Chave secreta JWT não configurada!');
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('auth_token');

  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(tokenCookie.value, getSecretKey());
    const userRole = payload.role as string;
    const userId = payload.userId as string;

    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    const companyUserRoutes = ['/dashboard', '/api/empresas', '/api/problemas', '/api/auth/me'];
    if (companyUserRoutes.some(path => pathname.startsWith(path))) {
      if (userRole !== 'USER') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/empresas/:path*',
    '/api/problemas/:path*',
    '/api/auth/me',
  ],
};