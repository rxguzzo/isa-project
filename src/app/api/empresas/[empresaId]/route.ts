// src/app/api/empresas/[empresaId]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: { empresaId: string } }) {
  const { empresaId } = context.params;
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const empresa = await prisma.empresa.findFirst({
      where: {
        id: empresaId,
        usuarios: {
          some: {
            id: usuarioId,
          },
        },
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