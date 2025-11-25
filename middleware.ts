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

    // Admin Route Protection
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Company User Route Protection
    const companyRoutes = ['/dashboard', '/api/empresas', '/api/problemas', '/api/auth/me'];
    if (companyRoutes.some(path => pathname.startsWith(path))) {
      if (userRole !== 'USER') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    // If authentication is successful, add headers and proceed
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    // If token is invalid, delete it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// ===== A CORREÇÃO ESTÁ AQUI =====
// Lista explícita de todas as rotas que o middleware deve proteger
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/empresas/:path*',
    '/api/problemas/:path*', // Protege rotas como /api/problemas/algum-id
    '/api/problemas',        // Protege a rota principal /api/problemas (para o POST)
    '/api/auth/me',
  ],
};