// src/app/api/empresas/[empresaId]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Função auxiliar para verificar se o usuário é o dono da empresa
async function checkUserAccessToCompany(empresaId: string, userId: string) {
  const empresa = await prisma.empresa.findFirst({
    where: { id: empresaId, usuarioId: userId },
  });
  return !!empresa;
}

export async function GET(request: Request, context: { params: Promise<{ empresaId: string }> }) {
  const { empresaId } = await context.params;
  const usuarioId = (await headers()).get('x-user-id');
  if (!usuarioId) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  const temAcesso = await checkUserAccessToCompany(empresaId, usuarioId);
  if (!temAcesso) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });

  const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
  return NextResponse.json(empresa);
}

export async function PUT(request: Request, context: { params: Promise<{ empresaId: string }> }) {
  const { empresaId } = await context.params;
  const usuarioId = (await headers()).get('x-user-id');
  if (!usuarioId) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  const temAcesso = await checkUserAccessToCompany(empresaId, usuarioId);
  if (!temAcesso) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });

  const body = await request.json();
  const updatedEmpresa = await prisma.empresa.update({
    where: { id: empresaId },
    data: body,
  });
  return NextResponse.json(updatedEmpresa);
}

export async function DELETE(request: Request, context: { params: Promise<{ empresaId: string }> }) {
  const { empresaId } = await context.params;
  const usuarioId = (await headers()).get('x-user-id');
  if (!usuarioId) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  const temAcesso = await checkUserAccessToCompany(empresaId, usuarioId);
  if (!temAcesso) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });

  await prisma.$transaction(async (tx) => {
    await tx.problema.deleteMany({ where: { empresaId: empresaId } });
    await tx.empresa.delete({ where: { id: empresaId } });
  });
  return NextResponse.json({ message: 'Empresa deletada com sucesso.' });
}