// src/app/api/empresas/[empresaId]/stats/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ empresaId: string }> }) {
  const { empresaId } = await context.params;
  const usuarioId = (await headers()).get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    // ===== CORREÇÃO AQUI =====
    // Verificação de Segurança para a relação "1 Usuário para Muitas Empresas"
    const empresaDoUsuario = await prisma.empresa.findFirst({
      where: { 
        id: empresaId, 
        usuarioId: usuarioId, // Verifica se o usuarioId da empresa é o mesmo do usuário logado
      }
    });

    if (!empresaDoUsuario) {
      return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
    }

    // Se a verificação passou, calcula as estatísticas
    const [demandasAbertas, demandasEmAnalise, demandasResolvidas] = await Promise.all([
      prisma.problema.count({ where: { empresaId: empresaId, status: 'aberto' } }),
      prisma.problema.count({ where: { empresaId: empresaId, status: 'em análise' } }),
      prisma.problema.count({ where: { empresaId: empresaId, status: 'resolvido' } }),
    ]);

    return NextResponse.json({
      demandasAbertas,
      demandasEmAnalise,
      demandasResolvidas,
    });
  } catch (error) {
    console.error(`Erro ao buscar estatísticas para a empresa ${empresaId}:`, error);
    return NextResponse.json({ message: 'Erro ao buscar estatísticas.' }, { status: 500 });
  }
}