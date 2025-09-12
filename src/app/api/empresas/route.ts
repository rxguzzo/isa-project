// src/app/api/empresas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const usuarioId = (await headers()).get('x-user-id'); // Injetado pelo middleware

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { razaoSocial, cnpj } = await request.json();

    if (!razaoSocial) {
      return NextResponse.json({ message: 'Razão Social é obrigatória.' }, { status: 400 });
    }

    // Opcional: Validar se o CNPJ, se fornecido, já existe
    if (cnpj) {
      const existingCnpj = await prisma.empresa.findUnique({ where: { cnpj } });
      if (existingCnpj) {
        return NextResponse.json({ message: 'Este CNPJ já está cadastrado.' }, { status: 409 });
      }
    }

    const novaEmpresa = await prisma.empresa.create({
      data: {
        razaoSocial,
        cnpj,
        usuarioId: usuarioId, // Associa a nova empresa ao usuário logado
      },
    });

    return NextResponse.json(novaEmpresa, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar empresa:", error);
    return NextResponse.json({ message: 'Erro ao cadastrar empresa.' }, { status: 500 });
  }
}