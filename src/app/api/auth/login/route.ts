// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    // 1. Tenta encontrar o usuário como Admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const senhaCorreta = await bcrypt.compare(senha, admin.senha);
      if (senhaCorreta) {
        // É um Admin! Gerar token de Admin.
        const tokenPayload = { userId: admin.id, email: admin.email, role: 'ADMIN' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '8h' });
        
        // CORREÇÃO AQUI
        // 1. Criamos o objeto de resposta PRIMEIRO
        const response = NextResponse.json({ redirectTo: '/admin/dashboard' });
        
        // 2. Usamos response.cookies.set() para definir o cookie
        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 8, // 8 horas
        });

        // 3. Retornamos o objeto de resposta modificado
        return response;
      }
    }

    // 2. Se não for Admin, tenta encontrar como Empresa
    const empresa = await prisma.empresa.findUnique({ where: { email } });
    if (empresa) {
      const senhaCorreta = await bcrypt.compare(senha, empresa.senha);
      if (senhaCorreta) {
        // É uma Empresa! Gerar token de Empresa.
        const tokenPayload = { userId: empresa.id, email: empresa.email, role: 'COMPANY' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '1d' });

        // CORREÇÃO AQUI
        const response = NextResponse.json({ redirectTo: '/dashboard' });
        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24, // 1 dia
        });
        return response;
      }
    }

    // 3. Se não encontrou ninguém ou a senha estava errada
    return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}