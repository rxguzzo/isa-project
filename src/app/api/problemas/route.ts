// src/app/api/problemas/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// =======================================================
// ===== FUNÇÃO GET (sem mudanças, busca os problemas) =====
// =======================================================
export async function GET(request: Request) {
  const headersList = await headers();
  const empresaId = headersList.get('x-user-id');

  if (!empresaId) {
    return NextResponse.json({ message: 'Acesso negado: ID da empresa não encontrado.' }, { status: 403 });
  }

  try {
    const problemas = await prisma.problema.findMany({
      where: { empresaId: empresaId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(problemas);
  } catch (error) {
    console.error("Erro na API /api/problemas GET:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar problemas.' }, { status: 500 });
  }
}


// ====================================================================================
// ===== FUNÇÃO POST ATUALIZADA (para salvar os dados do novo formulário detalhado) =====
// ====================================================================================
export async function POST(request: Request) {
  const headersList = await headers();
  const empresaId = headersList.get('x-user-id');

  if (!empresaId) {
    return NextResponse.json({ message: 'ID da empresa não encontrado.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { 
      areaDemanda, 
      assunto, 
      descricao, 
      objetivos, 
      nivelUrgencia, 
      orcamento, 
      comoConheceu, 
      consentimentoLGPD, 
      disponibilidadeVisita 
    } = body;

    // Validação dos campos obrigatórios do novo formulário
    if (!areaDemanda || areaDemanda.length === 0 || !assunto || !descricao || !nivelUrgencia || !consentimentoLGPD) {
      return NextResponse.json({ message: 'Campos obrigatórios não preenchidos.' }, { status: 400 });
    }

    // Converte o array de 'areaDemanda' em uma string única para salvar no SQLite
    const areaDemandaString = areaDemanda.join(', ');

    const novoProblema = await prisma.problema.create({
      data: {
        empresaId,
        areaDemanda: areaDemandaString, // Salva a string convertida
        assunto,
        descricao,
        objetivos,
        nivelUrgencia,
        orcamento,
        comoConheceu,
        consentimentoLGPD,
        disponibilidadeVisita,
        // O status 'aberto' é o padrão definido no schema e será adicionado automaticamente
      },
      // Incluímos o nome da empresa na resposta para atualizar a tabela do admin
      include: {
        empresa: {
          select: {
            razaoSocial: true,
          },
        },
      },
    });
    return NextResponse.json(novoProblema, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar problema:", error);
    return NextResponse.json({ message: 'Erro ao criar problema.' }, { status: 500 });
  }
}