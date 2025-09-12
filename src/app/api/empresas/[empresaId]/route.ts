// src/app/api/empresas/[empresaId]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// A MUDANÇA É AQUI NO SEGUNDO ARGUMENTO DA FUNÇÃO
export async function GET(request: Request, context: { params: { empresaId: string } }) {
  const { empresaId } = context.params; // Extraia empresaId primeiro
  const usuarioId = (await headers()).get('x-user-id'); // Agora pode usar await headers()

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const empresa = await prisma.empresa.findFirst({
      where: {
        id: empresaId,
        usuarioId: usuarioId,
      },
      select: {
        id: true,
        razaoSocial: true,
        cnpj: true,
      },
    });

    if (!empresa) {
      return NextResponse.json({ message: 'Empresa não encontrada ou não pertence a este usuário' }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro ao buscar detalhes da empresa:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}