// src/app/api/empresas/[empresaId]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Função auxiliar para verificar se o usuário logado TEM ACESSO à empresa
// Agora verifica se a empresa pertence ao usuarioId fornecido
async function checkUserAccessToCompany(empresaId: string, userId: string) {
  const empresa = await prisma.empresa.findFirst({
    where: {
      id: empresaId,
      usuarioId: userId, // Verifica se o usuarioId da empresa corresponde ao usuário logado
    },
  });
  return !!empresa; // Retorna true se a empresa for encontrada e pertencer ao usuário
}

// =======================================================
// Rota GET: Obter detalhes de UMA empresa
// =======================================================
export async function GET(request: Request, context: { params: { empresaId: string } }) {
  const { empresaId } = context.params;
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const temAcesso = await checkUserAccessToCompany(empresaId, usuarioId);
    if (!temAcesso) {
      return NextResponse.json({ message: 'Acesso negado. Esta empresa não pertence ao seu usuário.' }, { status: 403 });
    }

    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) {
      return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error(`Erro ao obter empresa ${empresaId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor ao obter empresa.' }, { status: 500 });
  }
}

// =======================================================
// Rota PUT: Atualizar detalhes de UMA empresa
// =======================================================
export async function PUT(request: Request, context: { params: { empresaId: string } }) {
  const { empresaId } = context.params;
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const temAcesso = await checkUserAccessToCompany(empresaId, usuarioId);
    if (!temAcesso) {
      return NextResponse.json({ message: 'Acesso negado. Esta empresa não pertence ao seu usuário.' }, { status: 403 });
    }

    const body = await request.json();
    const { razaoSocial, nomeFantasia, cnpj, endereco, telefone, emailContato } = body;

    // Optional: Re-clean CNPJ if it's being updated
    const cleanedCnpj = cnpj ? cnpj.replace(/[^\d]+/g, '') : undefined;

    const updatedEmpresa = await prisma.empresa.update({
      where: { id: empresaId },
      data: {
        razaoSocial,
        nomeFantasia,
        cnpj: cleanedCnpj, // Use cleaned CNPJ if provided, otherwise keep existing
        endereco,
        telefone,
        emailContato,
      },
    });

    return NextResponse.json(updatedEmpresa);
  } catch (error) {
    console.error(`Erro ao atualizar empresa ${empresaId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor ao atualizar empresa.' }, { status: 500 });
  }
}

// =======================================================
// Rota DELETE: Excluir UMA empresa (para o usuário)
// =======================================================
export async function DELETE(request: Request, context: { params: { empresaId: string } }) {
  const { empresaId } = context.params;
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const temAcesso = await checkUserAccessToCompany(empresaId, usuarioId);
    if (!temAcesso) {
      return NextResponse.json({ message: 'Acesso negado. Esta empresa não pertence ao seu usuário.' }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Excluir os problemas (demandas) associados à empresa
      await tx.problema.deleteMany({
        where: { empresaId: empresaId },
      });

      // 2. Finalmente, deletar a empresa
      await tx.empresa.delete({
        where: { id: empresaId },
      });
    });

    return NextResponse.json({ message: 'Empresa e seus dados relacionados foram deletados com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar empresa ${empresaId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor ao deletar empresa.' }, { status: 500 });
  }
}