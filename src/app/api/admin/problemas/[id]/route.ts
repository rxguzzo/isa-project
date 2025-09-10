// src/app/api/admin/problemas/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// O middleware já protege esta rota, garantindo que apenas admins possam acessá-la.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ message: 'Novo status é obrigatório.' }, { status: 400 });
    }

    const problemaAtualizado = await prisma.problema.update({
      where: { id: id },
      data: { status: status },
      include: { empresa: { select: { razaoSocial: true, email: true } } },
    });

    // AQUI é onde você adicionaria a lógica para enviar um e-mail de notificação
    // para problemaAtualizado.empresa.email informando a mudança de status.

    return NextResponse.json(problemaAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar o problema ${id}:`, error);
    return NextResponse.json({ message: 'Erro ao atualizar o status do problema.' }, { status: 500 });
  }
}