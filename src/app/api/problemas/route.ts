// src/app/api/problemas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

// Função para extrair o ID da empresa do token
const getEmpresaIdFromToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded.empresaId;
  } catch (error) {
    return null;
  }
};

// GET: Buscar todos os problemas da empresa logada
export async function GET(request: Request) {
  const empresaId = getEmpresaIdFromToken(request);
  if (!empresaId) {
    return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const problemas = await prisma.problema.findMany({
      where: { empresaId: empresaId },
      orderBy: { createdAt: 'desc' }, // Mais recentes primeiro
    });
    return NextResponse.json(problemas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar problemas' }, { status: 500 });
  }
}

// POST: Criar um novo problema
export async function POST(request: Request) {
  const empresaId = getEmpresaIdFromToken(request);
  if (!empresaId) {
    return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const { categoria, assunto, descricao } = await request.json();
    if (!categoria || !assunto || !descricao) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const novoProblema = await prisma.problema.create({
      data: {
        categoria,
        assunto,
        descricao,
        empresaId: empresaId,
        // O status padrão 'aberto' será definido pelo schema do Prisma
      },
    });

    return NextResponse.json(novoProblema, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar problema' }, { status: 500 });
  }
}