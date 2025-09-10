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
  const { pathname } = request.nextUrl;

  // Se não houver token, redireciona para o login imediatamente
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(tokenCookie.value, getSecretKey());
    const userRole = payload.role as string;
    const userId = payload.userId as string;

    // Verifica as rotas de Admin
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Verifica as rotas de Empresa (Dashboard e suas APIs)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/problemas') || pathname.startsWith('/api/auth/me')) {
      if (userRole !== 'COMPANY') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    // Se a autenticação foi bem-sucedida, adiciona o ID do usuário
    // nos headers para que as API Routes possam acessá-lo.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    // Se o token for inválido, apaga e redireciona
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// Configuração para dizer em quais rotas o middleware deve rodar
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/problemas/:path*',
    '/api/auth/me',
  ],
};