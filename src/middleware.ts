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

// Rotas de API respondem com JSON (401/403); páginas redirecionam para o login.
function negarAcesso(request: NextRequest, status: 401 | 403, limparCookie = false) {
  const isApi = request.nextUrl.pathname.startsWith('/api/');
  const response = isApi
    ? NextResponse.json(
        { message: status === 401 ? 'Não autenticado.' : 'Acesso negado.' },
        { status }
      )
    : NextResponse.redirect(new URL('/login', request.url));
  if (limparCookie) response.cookies.delete('auth_token');
  return response;
}

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('auth_token');

  if (!tokenCookie) {
    return negarAcesso(request, 401);
  }

  try {
    const { payload } = await jwtVerify(tokenCookie.value, getSecretKey());
    const userRole = payload.role as string;
    const userId = payload.userId as string;

    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'ADMIN') {
        return negarAcesso(request, 403);
      }
    }

    const companyUserRoutes = ['/dashboard', '/api/empresas', '/api/problemas', '/api/auth/me', '/api/usuario'];
    if (companyUserRoutes.some(path => pathname.startsWith(path))) {
      if (userRole !== 'USER') {
        return negarAcesso(request, 403);
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

  } catch {
    // Token inválido ou expirado
    return negarAcesso(request, 401, true);
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
    '/api/usuario',
  ],
};