// src/app/api/admin/problemas/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ message: 'Novo status é obrigatório.' }, { status: 400 });
    }

    const problemaAtualizado = await prisma.problema.update({
      where: { id: id },
      data: { status: status },
      // ===== A MUDANÇA ESTÁ AQUI =====
      include: { 
        empresa: { 
          select: { 
            razaoSocial: true,
            // Agora, para pegar o email do dono da empresa, acessamos a relação "usuario"
            usuario: { 
              select: { 
                email: true // Selecionamos o email do USUARIO que é dono da empresa
              } 
            } 
          } 
        } 
      },
    });
    
    // Se você estiver usando o email aqui, terá que acessá-lo como:
    // problemaAtualizado.empresa.usuario.email
    // const emailDoCliente = problemaAtualizado.empresa.usuario.email;

    return NextResponse.json(problemaAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar o problema ${id}:`, error);
    return NextResponse.json({ message: 'Erro ao atualizar o status do problema.' }, { status: 500 });
  }
}