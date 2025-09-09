// src/app/api/auth/me/route.ts
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
    console.error('Token verification failed:', error);
    return null;
  }
};

export async function GET(request: Request) {
  const empresaId = getEmpresaIdFromToken(request);
  if (!empresaId) {
    return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      // Selecionamos apenas os campos que queremos retornar para o frontend
      select: {
        id: true,
        razaoSocial: true,
        email: true,
        nomeResponsavel: true,
        telefone: true,
      },
    });

    if (!empresa) {
      return NextResponse.json({ message: 'Empresa não encontrada' }, { status: 404 });
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar dados da empresa' }, { status: 500 });
  }
}