// src/app/api/admin/empresas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Lembre-se: O nosso middleware (em src/middleware.ts) já está protegendo
  // esta rota, garantindo que apenas um usuário com o papel 'ADMIN'
  // consiga acessá-la. Por isso, não precisamos verificar o token aqui dentro.
  try {
    const empresas = await prisma.empresa.findMany({
      orderBy: {
        createdAt: 'desc', // Ordena as empresas da mais nova para a mais antiga
      },
    });
    return NextResponse.json(empresas);
  } catch (error) {
    // Se ocorrer um erro no banco de dados, logamos e retornamos um erro 500
    console.error('Erro ao buscar empresas:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor ao buscar empresas.' },
      { status: 500 }
    );
  }
}