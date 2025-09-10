// src/app/api/problemas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers'; // Importa a função headers

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const headersList = await headers(); // <<<--- CORREÇÃO AQUI: ADICIONAR 'await'
  const empresaId = headersList.get('x-user-id');

  if (!empresaId) {
    return NextResponse.json({ message: 'Acesso negado: ID da empresa não encontrado.' }, { status: 403 });
  }

  try {
    const problemas = await prisma.problema.findMany({
      where: { empresaId: empresaId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(problemas);
  } catch (error) {
    console.error("Erro na API /api/problemas GET:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar problemas.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const headersList = await headers(); // <<<--- CORREÇÃO AQUI: ADICIONAR 'await'
  const empresaId = headersList.get('x-user-id');

  if (!empresaId) {
    return NextResponse.json({ message: 'Acesso negado: ID da empresa não encontrado.' }, { status: 403 });
  }

  try {
    const { categoria, assunto, descricao } = await request.json();
    if (!categoria || !assunto || !descricao) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const novoProblema = await prisma.problema.create({
      data: { categoria, assunto, descricao, empresaId: empresaId },
    });
    return NextResponse.json(novoProblema, { status: 201 });
  } catch (error) {
    console.error("Erro na API /api/problemas POST:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao criar problema.' }, { status: 500 });
  }
}