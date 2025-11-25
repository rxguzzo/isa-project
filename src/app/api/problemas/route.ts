// src/app/api/problemas/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';



// ===================================================================================
// Rota POST: Usada pelo formulário de "nova demanda" para criar um problema
// ===================================================================================
export async function POST(request: NextRequest) {
  const headersList = await headers();
  const usuarioId = headersList.get('x-user-id');

  if (!usuarioId) {
    return NextResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      empresaId, // <-- O ID da empresa agora vem do CORPO da requisição
      assunto,
      descricao,
      objetivos,
      areaDemanda,
      nivelUrgencia,
      orcamento,
      comoConheceu,
      consentimentoLGPD,
      disponibilidadeVisita
    } = body;

    // --- Validações de Campos Obrigatórios ---
    if (!empresaId || !assunto || !descricao || !areaDemanda || !Array.isArray(areaDemanda) || areaDemanda.length === 0 || !nivelUrgencia) {
      return NextResponse.json({ message: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    // --- Validação de Segurança CORRIGIDA ---
    // Verifica se a empresa (empresaId) realmente pertence ao usuário logado (usuarioId)
    const empresaDoUsuario = await prisma.empresa.findFirst({
      where: {
        id: empresaId,
        usuarioId: usuarioId, // A verificação correta para a relação 1-para-Muitos
      },
    });

    if (!empresaDoUsuario) {
      return NextResponse.json({ message: 'Usuário não tem permissão para criar problemas nesta empresa.' }, { status: 403 });
    }

    // --- Criar o Problema no Banco de Dados ---
    const novoProblema = await prisma.problema.create({
      data: {
        empresaId, // Vincula o problema à empresa que foi validada
        assunto,
        descricao,
        objetivos,
        areaDemanda, // Passa o array diretamente (PostgreSQL aceita)
        nivelUrgencia,
        orcamento,
        comoConheceu,
        consentimentoLGPD: consentimentoLGPD ?? false,
        disponibilidadeVisita: disponibilidadeVisita ?? false,
      },
    });

    return NextResponse.json(novoProblema, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar problema:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: `Erro interno ao criar problema: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Erro interno ao criar problema.' }, { status: 500 });
  }
}

// ===================================================================================
// Rota GET: Esta rota é ambígua na nova arquitetura. A busca de problemas
// deve ser feita em um endpoint específico como /api/empresas/[empresaId]/problemas.
// Retornamos um erro claro para evitar uso incorreto.
// ===================================================================================
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Endpoint incorreto. Para buscar demandas de uma empresa, use GET /api/empresas/[empresaId]/problemas' },
    { status: 404 }
  );
}
