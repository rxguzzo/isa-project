// src/app/api/admin/problemas/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const userRole = (await headers()).get('x-user-role');
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { id } = context.params;
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ message: 'Novo status é obrigatório.' }, { status: 400 });
    }

    const problemaAtualizado = await prisma.problema.update({
      where: { id: id },
      data: { status: status },
    });

    // FUTURAMENTE: Aqui é o local ideal para adicionar a lógica de
    // envio de e-mail para notificar o cliente sobre a mudança de status.

    return NextResponse.json(problemaAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar o problema ${id}:`, error);
    return NextResponse.json({ message: 'Erro ao atualizar o status do problema.' }, { status: 500 });
  }
}