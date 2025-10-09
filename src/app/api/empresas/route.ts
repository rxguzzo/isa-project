// src/app/api/empresas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { razaoSocial, nomeFantasia, cnpj, endereco, telefone, emailContato } = body;

    if (!razaoSocial || !cnpj) {
      return NextResponse.json({ message: 'Razão Social e CNPJ são obrigatórios.' }, { status: 400 });
    }

    const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');

    if (cleanedCnpj.length !== 14 || !/^\d+$/.test(cleanedCnpj)) {
        return NextResponse.json({ message: 'CNPJ inválido. Deve conter 14 dígitos numéricos.' }, { status: 400 });
    }

    const existingCnpj = await prisma.empresa.findUnique({ where: { cnpj: cleanedCnpj } });
    if (existingCnpj) {
      return NextResponse.json({ message: 'Este CNPJ já está cadastrado.' }, { status: 409 });
    }

    // AGORA: Cria a empresa e JÁ ASSOCIA ao usuário logado via 'usuarioId'
    const novaEmpresa = await prisma.empresa.create({
      data: {
        razaoSocial,
        nomeFantasia,
        cnpj: cleanedCnpj,
        endereco,
        telefone,
        emailContato,
        usuarioId: usuarioId, // <--- AQUI ESTÁ A MUDANÇA!
      },
    });

    return NextResponse.json(novaEmpresa, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar empresa:", error);
    return NextResponse.json({ message: 'Erro ao cadastrar empresa.' }, { status: 500 });
  }
}