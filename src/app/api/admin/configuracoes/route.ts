// src/app/api/admin/configuracoes/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Essa API vai gerenciar uma única linha de configurações globais no banco de dados
// Vamos assumir que existe um modelo 'ConfiguracaoGlobal' no seu schema.prisma
// Ex:
// model ConfiguracaoGlobal {
//   id                       String @id @default(uuid())
//   notificacoesAtivas       Boolean @default(true)
//   modoManutencao           Boolean @default(false)
//   mensagemBoasVindas       String?
//   minVersaoAppRequerida    String?
//   createdAt                DateTime @default(now())
//   updatedAt                DateTime @updatedAt
// }

// Função auxiliar para verificar permissão
async function checkAdminPermission() {
  const userRole = (await headers()).get('x-user-role');
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const permissionError = await checkAdminPermission();
  if (permissionError) return permissionError;

  try {
    // Busca a única linha de configurações. Se não existir, cria uma padrão.
    let config = await prisma.configuracaoGlobal.findFirst();
    if (!config) {
      config = await prisma.configuracaoGlobal.create({
        data: {
          notificacoesAtivas: true,
          modoManutencao: false,
          mensagemBoasVindas: "Bem-vindo ao nosso sistema! Como podemos ajudar?",
        },
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro ao buscar configurações globais:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const permissionError = await checkAdminPermission();
  if (permissionError) return permissionError;

  try {
    const body = await request.json();
    // Assume que sempre atualizaremos o primeiro/único registro
    const updatedConfig = await prisma.configuracaoGlobal.updateMany({
      // Não há where para findFirst/updateMany, então garantimos que seja o único ou o primeiro
      // Em um ambiente real, você pode querer buscar pelo 'id'
      data: body,
    });

    // Após a atualização, busque o item para retornar o estado atualizado
    const config = await prisma.configuracaoGlobal.findFirst();

    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro ao atualizar configurações globais:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}