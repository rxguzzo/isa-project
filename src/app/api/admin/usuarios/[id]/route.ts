import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client'; // <-- 1. Importe 'Prisma'
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function isAdmin() {
  const userRole = (await headers()).get('x-user-role');
  return userRole === 'ADMIN';
}

// =======================================================
// Rota PUT: Atualizar os dados de um usuário
// =======================================================
export async function PUT(request: Request, context: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { id } = context.params;
  try {
    const { nome, email, role, senha } = await request.json();
    
    // 2. CORREÇÃO AQUI: Usamos o tipo correto do Prisma em vez de 'any'
    const dataToUpdate: Prisma.UsuarioUpdateInput = { nome, email, role };

    // Se uma nova senha for fornecida (não vazia), criptografa e adiciona aos dados
    if (senha && senha.length > 0) {
      dataToUpdate.senha = await bcrypt.hash(senha, 10);
    }

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
    });
    
    // Remove a senha do objeto retornado para segurança
    const { senha: _, ...usuarioSeguro } = updatedUser;
    return NextResponse.json(usuarioSeguro);
  } catch (error) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    return NextResponse.json({ message: 'Erro ao atualizar usuário.' }, { status: 500 });
  }
}

// =======================================================
// Rota DELETE: Deletar um usuário
// =======================================================
export async function DELETE(request: Request, context: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { id } = context.params;
  try {
    // Lógica de segurança para não permitir que o admin se auto-delete
    const currentUserId = (await headers()).get('x-user-id');
    if (id === currentUserId) {
        return NextResponse.json({ message: 'Você não pode se auto-deletar.' }, { status: 400 });
    }

    await prisma.usuario.delete({ where: { id } });
    return NextResponse.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar usuário ${id}:`, error);
    return NextResponse.json({ message: 'Erro ao deletar usuário.' }, { status: 500 });
  }
}

