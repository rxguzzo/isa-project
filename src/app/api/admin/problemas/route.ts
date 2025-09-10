// src/app/api/admin/problemas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Não precisamos de verificação de token aqui, pois o Middleware já fará isso!

const prisma = new PrismaClient();

export async function GET() {
  try {
    // O middleware já garantiu que quem chegou aqui é um ADMIN
    const problemas = await prisma.problema.findMany({
      orderBy: { createdAt: 'desc' },
      include: { empresa: { select: { razaoSocial: true, email: true } } }, // Inclui nome e email da empresa
    });
    return NextResponse.json(problemas);
  } catch (error) {
    console.error('Erro ao buscar problemas:', error);
    return NextResponse.json({ message: 'Erro ao buscar problemas.' }, { status: 500 });
  }
}