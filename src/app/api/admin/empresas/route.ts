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
      // CORREÇÃO AQUI: Trocado 'usuarios' por 'usuario'
      // Inclui o usuário único que é o dono da empresa
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(empresas);
  } catch (error) {
    console.error("Erro ao buscar empresas para admin:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userRole = (await headers()).get('x-user-role');
  const usuarioId = (await headers()).get('x-user-id'); // Precisamos do ID do admin para associar

  if (userRole !== 'ADMIN' || !usuarioId) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { razaoSocial, cnpj, ...outrosDados } = body;
    
    if (!razaoSocial || !cnpj) {
      return NextResponse.json({ message: 'Razão Social e CNPJ são obrigatórios.' }, { status: 400 });
    }

    const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');
    // ... (sua outra lógica de validação de CNPJ)

    const novaEmpresa = await prisma.empresa.create({
      data: {
        razaoSocial,
        cnpj: cleanedCnpj,
        ...outrosDados,
        usuarioId: usuarioId, // Associa a nova empresa ao admin que a criou
      },
    });

    return NextResponse.json(novaEmpresa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return NextResponse.json({ message: 'Erro interno ao criar empresa.' }, { status: 500 });
  }
}

