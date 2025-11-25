// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();

    // Validações no Backend
    if (!nome || !email || !senha) {
      return NextResponse.json({ message: 'Nome, e-mail e senha são obrigatórios.' }, { status: 400 });
    }
    if (senha.length < 8) {
      return NextResponse.json({ message: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'E-mail já cadastrado.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role: 'USER',
      },
    });

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    return NextResponse.json(usuarioSemSenha, { status: 201 });

  } catch (error) {
    console.error("Erro no registro de usuário:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}