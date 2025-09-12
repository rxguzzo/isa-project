// src/app/api/admin/problemas/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // O middleware injeta o 'x-user-role' no cabeçalho.
  // Lemos o cabeçalho para garantir que apenas um admin possa acessar esta rota.
  const userRole = (await headers()).get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }

  try {
    // Busca todos os problemas no banco de dados
    const problemas = await prisma.problema.findMany({
      orderBy: {
        createdAt: 'desc', // Ordena do mais novo para o mais antigo
      },
      // Inclui dados da empresa relacionada a cada problema
      include: {
        empresa: {
          // Seleciona apenas a razão social da empresa para exibir na tabela
          select: {
            razaoSocial: true,
          },
        },
      },
    });

    // Retorna a lista de problemas em formato JSON
    return NextResponse.json(problemas);
  } catch (error) {
    // Em caso de erro no banco de dados, loga o erro no terminal do servidor
    // e retorna uma mensagem de erro genérica.
    console.error("Erro ao buscar problemas para admin:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar problemas.' }, { status: 500 });
  }
}