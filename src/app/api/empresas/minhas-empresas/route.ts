// src/app/api/empresas/minhas-empresas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const empresas = await prisma.empresa.findMany({
      where: { usuarioId: usuarioId },
      orderBy: { razaoSocial: 'asc' },
    });

    return NextResponse.json(empresas);
  } catch (error) {
    console.error("Erro ao buscar empresas do usuário:", error);
    return NextResponse.json({ message: 'Erro ao buscar empresas do usuário.' }, { status: 500 });
  }
}