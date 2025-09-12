// src/app/api/admin/problemas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const userRole = (await headers()).get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const problemas = await prisma.problema.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // ===== CORREÇÃO AQUI =====
      // Simplificamos a consulta para buscar apenas o que a tabela precisa.
      include: {
        empresa: {
          select: {
            razaoSocial: true, // Apenas o nome da empresa
          },
        },
      },
    });
    return NextResponse.json(problemas);
  } catch (error) {
    // Se ocorrer um erro, ele será logado no terminal do servidor
    console.error("Erro ao buscar problemas para admin:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar problemas.' }, { status: 500 });
  }
}