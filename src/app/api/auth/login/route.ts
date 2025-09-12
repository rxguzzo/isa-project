// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const tokenPayload = { userId: usuario.id, email: usuario.email, role: usuario.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: usuario.role === 'ADMIN' ? '8h' : '1d', // Token de admin pode ser mais longo
    });

    const redirectTo = usuario.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

    const response = NextResponse.json({ redirectTo });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax', // Use 'lax' ou 'strict' dependendo da sua necessidade
    });

    return response;

  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}