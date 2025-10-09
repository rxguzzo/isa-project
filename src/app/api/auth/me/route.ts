// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Esta rota deve retornar os dados do USUÁRIO logado, não da empresa
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Acesso negado: ID de usuário não encontrado.' }, { status: 403 });
  }

  try {
    // Buscamos o USUÁRIO pelo ID fornecido pelo middleware
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      // Selecionamos os campos que queremos retornar (sem a senha!)
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        // Se quisermos as empresas dele, podemos incluir aqui
        empresas: {
          select: {
            id: true,
            razaoSocial: true,
          }
        }
      },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }
    
    // Retornamos os dados do USUÁRIO
    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro na API /api/auth/me:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar dados do usuário.' }, { status: 500 });
  }
}