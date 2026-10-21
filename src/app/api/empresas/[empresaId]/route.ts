// src/app/api/empresas/[empresaId]/route.ts
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';



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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'JSON inválido.' }, { status: 400 });
  }

  // Só estes campos podem ser editados pelo dono. Qualquer outro campo enviado
  // pelo cliente (ex.: usuarioId, cnpj, id) é ignorado.
  const data: Prisma.EmpresaUpdateInput = {};

  // Razão social é obrigatória no banco: se vier, precisa ser texto não vazio
  if ('razaoSocial' in body) {
    const razaoSocial = body.razaoSocial;
    if (typeof razaoSocial !== 'string' || razaoSocial.trim() === '') {
      return NextResponse.json({ message: 'Razão social é obrigatória.' }, { status: 400 });
    }
    data.razaoSocial = razaoSocial.trim();
  }

  // Campos opcionais: texto, ou vazio/null para limpar
  const CAMPOS_OPCIONAIS = ['nomeFantasia', 'endereco', 'telefone', 'emailContato'] as const;
  for (const campo of CAMPOS_OPCIONAIS) {
    if (!(campo in body)) continue;
    const valor = body[campo];
    if (valor !== null && typeof valor !== 'string') {
      return NextResponse.json({ message: `Campo ${campo} inválido.` }, { status: 400 });
    }
    const texto = typeof valor === 'string' ? valor.trim() : '';
    data[campo] = texto === '' ? null : texto;
  }

  try {
    const updatedEmpresa = await prisma.empresa.update({
      where: { id: empresaId },
      data,
    });
    return NextResponse.json(updatedEmpresa);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: 'Já existe uma empresa com essa razão social.' }, { status: 409 });
    }
    console.error('Erro ao atualizar empresa:', error);
    return NextResponse.json({ message: 'Erro interno ao atualizar empresa.' }, { status: 500 });
  }
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