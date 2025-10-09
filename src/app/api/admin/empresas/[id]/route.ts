// src/app/api/admin/empresas/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Função auxiliar para verificar se o usuário é Admin
async function isAdmin() {
  const userRole = (await headers()).get('x-user-role');
  return userRole === 'ADMIN';
}

// =======================================================
// Rota GET: Buscar uma única empresa pelo ID (para o admin)
// =======================================================
export async function GET(request: Request, context: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { id } = context.params;
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      // CORREÇÃO AQUI: Trocado 'usuarios' por 'usuario'
      // Inclui o usuário dono da empresa
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

    if (!empresa) {
      return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error(`Erro ao buscar empresa ${id}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// =======================================================
// Rota PUT: Atualizar os dados de uma empresa (para o admin)
// =======================================================
export async function PUT(request: Request, context: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { id } = context.params;
  try {
    const body = await request.json();
    
    // Remove campos que não devem ser atualizados por esta rota para segurança
    // Mantenha 'usuarioId' na desestruturação caso o admin queira mudar o dono da empresa
    const { id: bodyId, createdAt, updatedAt, problemas, ...dataToUpdate } = body;

    const updatedEmpresa = await prisma.empresa.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedEmpresa);
  } catch (error) {
    console.error(`Erro ao atualizar empresa ${id}:`, error);
    return NextResponse.json({ message: 'Erro ao atualizar empresa.' }, { status: 500 });
  }
}

// =======================================================
// Rota DELETE: Excluir uma empresa e seus dados relacionados (para o admin)
// =======================================================
export async function DELETE(request: Request, context: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { id } = context.params;
  try {
    // Usamos uma transação para garantir que todas as operações sejam bem-sucedidas ou nenhuma seja
    await prisma.$transaction(async (tx) => {
      // 1. Deletar todos os problemas associados a esta empresa
      await tx.problema.deleteMany({
        where: { empresaId: id },
      });

      // 2. Deletar a empresa
      // Como 'usuarioId' na Empresa é um campo obrigatório (não-nulo),
      // e um Usuario pode ter muitas Empresas, não precisamos atualizar o Usuario.
      // A Empresa será simplesmente removida, e a lista de 'empresas' do Usuario será atualizada pelo Prisma.
      await tx.empresa.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: 'Empresa e dados relacionados foram deletados com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar empresa ${id}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor ao deletar empresa.' }, { status: 500 });
  }
}