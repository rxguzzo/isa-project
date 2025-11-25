// src/app/api/admin/problemas/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';



export async function GET(request: NextRequest) {
  const userRole = (await headers()).get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // 2. Aplique o tipo correto em vez de 'any'
    const where: Prisma.ProblemaWhereInput = {};

    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { assunto: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
        { empresa: { razaoSocial: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const problemas = await prisma.problema.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
      },
    });
    return NextResponse.json(problemas);
  } catch (error) {
    console.error("Erro ao buscar problemas para admin:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar problemas.' }, { status: 500 });
  }
}