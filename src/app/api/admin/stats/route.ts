// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';



export async function GET() {
  const userRole = (await headers()).get('x-user-role');
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
  }

  try {
    const [totalEmpresas, demandasAbertas, demandasEmAnalise, demandasResolvidas] = await Promise.all([
      prisma.empresa.count(),
      prisma.problema.count({ where: { status: 'aberto' } }),
      prisma.problema.count({ where: { status: 'em análise' } }),
      prisma.problema.count({ where: { status: 'resolvido' } }),
    ]);

    return NextResponse.json({
      totalEmpresas,
      demandasAbertas,
      demandasEmAnalise,
      demandasResolvidas,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json({ message: 'Erro interno ao buscar estatísticas.' }, { status: 500 });
  }
}