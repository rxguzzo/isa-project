import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { senhaForte, REGRA_SENHA } from '@/lib/senha';

type UpdatePayload = {
  nome?: string;
  email?: string;
  senhaAtual?: string;
  novaSenha?: string;
  confirmarSenha?: string;
};

export async function GET() {
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!usuario) {
    return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(usuario);
}

export async function PUT(request: Request) {
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as UpdatePayload;
    const { nome, email, senhaAtual, novaSenha, confirmarSenha } = body;

    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    if (email && email !== usuario.email) {
      const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
      if (emailEmUso) {
        return NextResponse.json({ message: 'E-mail já está em uso.' }, { status: 409 });
      }
    }

    if (novaSenha || confirmarSenha) {
      if (!senhaAtual) {
        return NextResponse.json({ message: 'Senha atual é obrigatória para alterar a senha.' }, { status: 400 });
      }
      if (!senhaForte(novaSenha)) {
        return NextResponse.json({ message: REGRA_SENHA }, { status: 400 });
      }
      if (novaSenha !== confirmarSenha) {
        return NextResponse.json({ message: 'A confirmação da senha não corresponde à nova senha.' }, { status: 400 });
      }

      const senhaOk = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaOk) {
        return NextResponse.json({ message: 'Senha atual inválida.' }, { status: 401 });
      }
    }

    const dataToUpdate: { nome?: string; email?: string; senha?: string } = {};
    if (typeof nome === 'string') dataToUpdate.nome = nome.trim();
    if (typeof email === 'string') dataToUpdate.email = email.trim();
    if (novaSenha) dataToUpdate.senha = await bcrypt.hash(novaSenha, 10);

    const updatedUsuario = await prisma.usuario.update({
      where: { id: usuarioId },
      data: dataToUpdate,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUsuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ message: 'Erro ao atualizar usuário.' }, { status: 500 });
  }
}
