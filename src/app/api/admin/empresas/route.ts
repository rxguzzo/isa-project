// src/app/api/admin/empresas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers'; // Importar headers

const prisma = new PrismaClient();

export async function GET() {
  const userRole = (await headers()).get('x-user-role'); // Pegue o role
  const usuarioId = (await headers()).get('x-user-id'); // Pegue o ID também, se precisar futuramente

  // ----- A VERIFICAÇÃO ESTÁ AQUI -----
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado. Apenas administradores.' }, { status: 403 });
  }
  // ------------------------------------

  try {
    const empresas = await prisma.empresa.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: { // Inclui o usuário para saber quem é o dono da empresa
          select: {
            email: true,
            // Adicione outros campos do usuário que o admin precise ver
          }
        }
      }
    });
    return NextResponse.json(empresas);
  } catch (error) {
    console.error("Erro ao buscar empresas para admin:", error);
    return NextResponse.json({ message: 'Erro ao buscar empresas.' }, { status: 500 });
  }
}