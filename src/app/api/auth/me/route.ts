// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro na API /api/auth/me:", error);
    return NextResponse.json({ message: 'Erro ao buscar dados do usuário.' }, { status: 500 });
  }
}