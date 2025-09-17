// src/app/api/admin/empresas/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Função auxiliar para verificar permissão
async function checkAdminPermission() {
  const userRole = (await headers()).get('x-user-role');
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }
  return null;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const permissionError = await checkAdminPermission();
  if (permissionError) return permissionError;

  const { id } = params;
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!empresa) {
      return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionError = await checkAdminPermission();
  if (permissionError) return permissionError;

  const { id } = params;
  try {
    const body = await request.json();
    const updatedEmpresa = await prisma.empresa.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedEmpresa);
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionError = await checkAdminPermission();
  if (permissionError) return permissionError;

  const { id } = params;
  try {
    // Antes de deletar a empresa, precisamos remover todos os usuários associados a ela
    // ou reassociá-los, dependendo da sua regra de negócio.
    // Por simplicidade aqui, vamos deletar usuários também.
    // Se a sua empresa tiver outras relações (problemas, etc.), você também precisará gerenciá-las.
    await prisma.usuario.deleteMany({
      where: { empresaId: id },
    });

    await prisma.empresa.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Empresa deletada com sucesso.' });
  } catch (error) {
    console.error("Erro ao deletar empresa:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}