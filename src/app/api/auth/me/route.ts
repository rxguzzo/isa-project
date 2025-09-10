// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers'; // Importa a função headers

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const headersList = await headers(); // <<<--- CORREÇÃO AQUI: ADICIONAR 'await'
  const empresaId = headersList.get('x-user-id');

  if (!empresaId) {
    // Se o middleware não enviou o ID, algo está errado na cadeia de autenticação
    return NextResponse.json({ message: 'Acesso negado: ID da empresa não encontrado.' }, { status: 403 });
  }

  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { id: true, razaoSocial: true, email: true, nomeResponsavel: true, telefone: true },
    });

    if (!empresa) {
      return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404 });
    }
    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro na API /api/auth/me:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar dados da empresa.' }, { status: 500 });
  }
}