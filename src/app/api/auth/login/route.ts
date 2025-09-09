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
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    // 1. Encontrar a empresa pelo email
    const empresa = await prisma.empresa.findUnique({
      where: { email },
    });

    if (!empresa) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 } // Unauthorized
      );
    }

    // 2. Comparar a senha enviada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, empresa.senha);

    if (!senhaCorreta) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 } // Unauthorized
      );
    }

    // 3. Gerar o JSON Web Token (JWT)
    const tokenPayload = {
      empresaId: empresa.id,
      email: empresa.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d', // Token expira em 1 dia
    });

    return NextResponse.json({ message: 'Login bem-sucedido!', token }, { status: 200 });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}