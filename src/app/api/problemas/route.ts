// src/app/api/problemas/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Esta rota é responsável por CRIAR uma nova demanda (problema).
// A busca de problemas (GET) agora é feita em rotas mais específicas
// como /api/empresas/[empresaId]/problemas.
export async function POST(request: Request) {
  // O middleware injeta o ID do usuário logado no cabeçalho.
  const headersList = await headers();
  const usuarioId = headersList.get('x-user-id');

  // Se o middleware falhou ou o usuário não está logado, negamos o acesso.
  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    // Pegamos todos os dados enviados pelo formulário no corpo da requisição.
    const body = await request.json();
    const { 
      empresaId, // O ID da empresa para a qual a demanda está sendo criada
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

    // Verificação de Segurança Crucial:
    // Garante que a empresa (empresaId) realmente pertence ao usuário logado (usuarioId).
    // Isso impede que um usuário crie demandas para empresas de outros usuários.
    const empresaDoUsuario = await prisma.empresa.findFirst({
      where: { 
        id: empresaId, 
        usuarioId: usuarioId 
      }
    });

    if (!empresaDoUsuario) {
      return NextResponse.json({ message: 'Acesso negado: esta empresa não pertence a este usuário.' }, { status: 403 }); // 403 Forbidden
    }

    // Validação dos campos obrigatórios do formulário
    if (!areaDemanda || !Array.isArray(areaDemanda) || areaDemanda.length === 0 || !assunto || !descricao) {
      return NextResponse.json({ message: 'Campos obrigatórios (Área, Assunto, Descrição) não preenchidos.' }, { status: 400 });
    }

    // Converte o array 'areaDemanda' em uma única string para salvar no banco
    const areaDemandaString = areaDemanda.join(', ');

    // Cria o novo problema no banco de dados, associado à empresa correta
    const novoProblema = await prisma.problema.create({
      data: {
        empresaId: empresaId,
        areaDemanda: areaDemandaString,
        assunto,
        descricao,
        objetivos,
        nivelUrgencia,
        orcamento,
        comoConheceu,
        consentimentoLGPD,
        disponibilidadeVisita,
      },
    });
    
    // Retorna o problema recém-criado com o status 201 (Criado com sucesso)
    return NextResponse.json(novoProblema, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar problema:", error);
    return NextResponse.json({ message: 'Erro interno do servidor ao criar problema.' }, { status: 500 });
  }
}