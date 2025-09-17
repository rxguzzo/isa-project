// src/app/api/admin/empresas/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const userRole = (await headers()).get('x-user-role');
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where: Prisma.EmpresaWhereInput = {};

    if (search) {
      where.OR = [
        { razaoSocial: { contains: search, mode: 'insensitive' } },
        { nomeFantasia: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search, mode: 'insensitive' } },
      ];
    }

    const empresas = await prisma.empresa.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      // A correção está aqui: garantimos que a relação 'usuarios' seja incluída
      include: {
        usuarios: {
          select: { 
            id: true,
            nome: true, // Incluindo o nome para referência futura
          },
        },
      },
    });

    // O Prisma já retorna `usuarios` como um array, então podemos contar o tamanho
    const empresasComContagem = empresas.map(emp => ({
      ...emp,
      totalUsuarios: emp.usuarios.length,
    }));

    return NextResponse.json(empresasComContagem);
  } catch (error) {
    console.error("Erro ao buscar empresas para admin:", error);
    // O log do erro no terminal do servidor nos dirá o problema exato
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar empresas.' }, { status: 500 });
  }
}

// A função POST para criar uma empresa, caso precise dela aqui
export async function POST(request: NextRequest) {
    // ... (seu código para o POST, se aplicável a esta rota)
}