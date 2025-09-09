// src/app/api/empresas/cadastro/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razaoSocial, cnpj, nomeResponsavel, email, telefone, senha } = body;

    // 1. Validação básica dos dados recebidos
    if (!razaoSocial || !cnpj || !nomeResponsavel || !email || !telefone || !senha) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 } // Bad Request
      );
    }

    // 2. Verificar se o email ou CNPJ já existem no banco
    const empresaExistente = await prisma.empresa.findFirst({
      where: { OR: [{ email: email }, { cnpj: cnpj }] },
    });

    if (empresaExistente) {
      const campoDuplicado = empresaExistente.email === email ? 'Email' : 'CNPJ';
      return NextResponse.json(
        { message: `${campoDuplicado} já cadastrado.` },
        { status: 409 } // Conflict
      );
    }

    // 3. Criptografar a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10); // O segundo argumento é o "salt rounds"

    // 4. Criar a nova empresa no banco de dados
    const novaEmpresa = await prisma.empresa.create({
      data: {
        razaoSocial,
        cnpj,
        nomeResponsavel,
        email,
        telefone,
        senha: senhaHash, // Salvar a senha criptografada
      },
    });

    // 5. Retornar uma resposta de sucesso (sem a senha!)
    const { senha: _, ...empresaSemSenha } = novaEmpresa;
    return NextResponse.json(empresaSemSenha, { status: 201 }); // Created

  } catch (error) {
    console.error('Erro no cadastro de empresa:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}