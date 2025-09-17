// src/app/api/problemas/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client'; // Importar Prisma para os tipos
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// ===================================================================================
// Rota POST: Criar um novo problema para a empresa selecionada
// ===================================================================================
export async function POST(request: NextRequest) {
  const headersList = await headers();
  const usuarioId = headersList.get('x-user-id');
  const empresaIdFromHeader = headersList.get('x-empresa-id'); // ID da empresa selecionada pelo usuário

  // Verifica se o usuário está autenticado
  if (!usuarioId) {
    return NextResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
  }
  // Verifica se o ID da empresa foi fornecido no cabeçalho
  if (!empresaIdFromHeader) {
    return NextResponse.json({ message: 'ID da empresa não fornecido no cabeçalho.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { 
      assunto,
      descricao,
      objetivos,
      areaDemanda, // Esperado como String[] (array de strings)
      nivelUrgencia,
      orcamento,
      comoConheceu,
      consentimentoLGPD,
      disponibilidadeVisita,
      status // Pode ser definido pelo front, ou usaremos o default do Prisma
    } = body;

    // --- Validações de Campos Obrigatórios ---
    if (!assunto || !descricao || !areaDemanda || areaDemanda.length === 0 || !nivelUrgencia) {
      return NextResponse.json({ message: 'Campos obrigatórios faltando: assunto, descrição, área da demanda e nível de urgência.' }, { status: 400 });
    }

    // --- Validação de Segurança: Verificar se o usuário pertence à empresa informada ---
    const usuarioPertenceAEmpresa = await prisma.usuario.findFirst({
      where: {
        id: usuarioId,
        empresaId: empresaIdFromHeader,
      },
    });

    if (!usuarioPertenceAEmpresa) {
      return NextResponse.json({ message: 'Usuário não tem permissão para criar problemas nesta empresa.' }, { status: 403 });
    }

    // --- Criar o Problema no Banco de Dados ---
    const novoProblema = await prisma.problema.create({
      data: {
        empresaId: empresaIdFromHeader, // Vincula o problema à empresa do cabeçalho
        assunto,
        descricao,
        objetivos,
        areaDemanda, // Passa o array diretamente (PostgreSQL aceita)
        nivelUrgencia,
        orcamento,
        comoConheceu,
        consentimentoLGPD: consentimentoLGPD ?? false, // Garante um valor booleano
        disponibilidadeVisita: disponibilidadeVisita ?? false, // Garante um valor booleano
        status: status || 'aberto', // Garante um status, usando 'aberto' como padrão se não for fornecido
      },
    });

    return NextResponse.json(novoProblema, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar problema:", error);
    if (error instanceof Error) {
      // Retorna uma mensagem de erro mais detalhada em ambiente de desenvolvimento, se necessário
      return NextResponse.json({ message: `Erro interno ao criar problema: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Erro interno ao criar problema.' }, { status: 500 });
  }
}

// ===================================================================================
// Rota GET: Listar problemas para a empresa selecionada, com filtros
// ===================================================================================
export async function GET(request: NextRequest) {
  const headersList = await headers();
  const usuarioId = headersList.get('x-user-id');
  const empresaIdFromHeader = headersList.get('x-empresa-id'); // ID da empresa selecionada pelo usuário

  // Verifica se o usuário está autenticado
  if (!usuarioId) {
    return NextResponse.json({ message: 'Autenticação necessária.' }, { status: 401 });
  }
  // Verifica se o ID da empresa foi fornecido no cabeçalho
  if (!empresaIdFromHeader) {
    return NextResponse.json({ message: 'ID da empresa não fornecido no cabeçalho.' }, { status: 400 });
  }

  try {
    // --- Validação de Segurança: Verificar se o usuário pertence à empresa informada ---
    const usuarioPertenceAEmpresa = await prisma.usuario.findFirst({
      where: {
        id: usuarioId,
        empresaId: empresaIdFromHeader,
      },
    });

    if (!usuarioPertenceAEmpresa) {
      return NextResponse.json({ message: 'Usuário não tem permissão para visualizar problemas desta empresa.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const filterStatus = searchParams.get('status') || 'all';

    // Inicializa a cláusula WHERE com o filtro obrigatório por empresaId
    const whereClause: Prisma.ProblemaWhereInput = {
      empresaId: empresaIdFromHeader, // Apenas problemas da empresa selecionada
    };

    // Adiciona filtro por termo de busca, se houver
    if (searchTerm) {
      whereClause.OR = [
        { assunto: { contains: searchTerm, mode: 'insensitive' } },
        { descricao: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Adiciona filtro por status, se não for 'all'
    if (filterStatus !== 'all') {
      whereClause.status = filterStatus;
    }

    // --- Buscar os Problemas no Banco de Dados ---
    const problemas = await prisma.problema.findMany({
      where: whereClause,
      include: {
        empresa: { // Inclui informações básicas da empresa associada
          select: {
            id: true,
            razaoSocial: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }, // Ordena pelos mais recentes
    });

    return NextResponse.json(problemas);

  } catch (error) {
    console.error("Erro ao buscar problemas:", error);
    if (error instanceof Error) {
      // Retorna uma mensagem de erro mais detalhada em ambiente de desenvolvimento, se necessário
      return NextResponse.json({ message: `Erro interno ao buscar problemas: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Erro interno ao buscar problemas.' }, { status: 500 });
  }
}