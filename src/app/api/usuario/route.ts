import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 



export async function GET() {
  // Aqui você pode usar autenticação real (como NextAuth) para pegar o usuário logado
  // Mas para teste, vamos buscar o primeiro usuário do banco

  const usuario = await prisma.usuario.findFirst({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!usuario) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json(usuario);
}
