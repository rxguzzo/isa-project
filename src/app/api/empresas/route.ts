// src/app/api/empresas/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';



export async function POST(request: Request) {
  const usuarioId = (await headers()).get('x-user-id');
  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { razaoSocial, cnpj, ...outrosDados } = body;

    if (!razaoSocial || !cnpj) {
      return NextResponse.json({ message: 'Razão Social e CNPJ são obrigatórios.' }, { status: 400 });
    }

    const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');
    const existingCnpj = await prisma.empresa.findUnique({ where: { cnpj: cleanedCnpj } });
    if (existingCnpj) {
      return NextResponse.json({ message: 'Este CNPJ já está cadastrado.' }, { status: 409 });
    }

    const novaEmpresa = await prisma.empresa.create({
      data: {
        ...outrosDados,
        razaoSocial,
        cnpj: cleanedCnpj,
        usuarioId: usuarioId, // Associa a empresa ao usuário dono
      },
    });

    return NextResponse.json(novaEmpresa, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar empresa:", error);
    return NextResponse.json({ message: 'Erro ao cadastrar empresa.' }, { status: 500 });
  }
}