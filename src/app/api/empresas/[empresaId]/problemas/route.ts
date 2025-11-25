// src/app/api/empresas/[empresaId]/problemas/route.ts
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
    // Validação de Segurança: Garante que a empresa pertence ao usuário logado
    const empresaDoUsuario = await prisma.empresa.findFirst({
      where: { 
        id: empresaId, 
        usuarioId: usuarioId,
      }
    });

    if (!empresaDoUsuario) {
      return NextResponse.json({ message: 'Acesso negado a esta empresa.' }, { status: 403 });
    }

    // Se a permissão estiver correta, busca os problemas da empresa
    const problemas = await prisma.problema.findMany({
      where: { empresaId: empresaId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(problemas);
  } catch (error) {
    console.error(`Erro ao buscar problemas para a empresa ${empresaId}:`, error);
    return NextResponse.json({ message: 'Erro ao buscar demandas.' }, { status: 500 });
  }
}

