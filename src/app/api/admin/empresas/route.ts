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
      include: {
        usuarios: {
          select: { id: true }, // Contar usuários relacionados
        },
      },
    });

    // Adiciona um campo de 'totalUsuarios' para cada empresa
    const empresasComContagem = empresas.map(emp => ({
      ...emp,
      totalUsuarios: emp.usuarios.length,
    }));

    return NextResponse.json(empresasComContagem);
  } catch (error) {
    console.error("Erro ao buscar empresas para admin:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userRole = (await headers()).get('x-user-role');
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    // Validação básica
    if (!body.razaoSocial || !body.cnpj) {
      return NextResponse.json({ message: 'Razão Social e CNPJ são obrigatórios.' }, { status: 400 });
    }

    const novaEmpresa = await prisma.empresa.create({
      data: body,
    });

    return NextResponse.json(novaEmpresa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return NextResponse.json({ message: 'Erro interno ao criar empresa.' }, { status: 500 });
  }
}