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

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/login', '/cadastro', '/'];
  const { pathname } = request.nextUrl;

  // Se a rota for pública, apenas continua
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  // Se não há token e não é uma rota pública, redireciona para o login
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(tokenCookie.value, getSecretKey());
    const userId = payload.userId as string;
    const userRole = payload.role as string; // Obtenha o role do payload

    // Redirecionamento de admin e user para seus dashboards específicos se tentarem ir para '/'
    if (pathname === '/' && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (pathname === '/' && userRole === 'USER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Proteção de Rotas de Admin
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'ADMIN') {
        // Se não for admin, nega e redireciona para o dashboard de usuário
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Proteção de Rotas de Empresa (Usuário Comum)
    // Se um admin tentar acessar o dashboard de usuário, permitimos (pode ser útil para debug ou gerenciamento)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/empresas') || pathname.startsWith('/api/problemas')) {
      if (userRole !== 'USER' && userRole !== 'ADMIN') { 
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // AQUI ESTÁ A CHAVE: Clone a requisição e adicione os cabeçalhos x-user-id e x-user-role
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', userRole); // <--- INJETANDO O ROLE TAMBÉM

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    console.error('Token inválido ou erro de verificação:', err);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// Lista explícita de todas as rotas que o middleware deve proteger
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/empresas/:path*',
    '/api/problemas/:path*',
    // '/api/auth/me', // Pode ser removido se não houver uma rota /api/auth/me que precise de auth
    // Adicione outras rotas de API que você precisa proteger aqui
  ],
};