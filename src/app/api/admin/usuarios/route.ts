import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';



async function isAdmin() {
  const userRole = (await headers()).get('x-user-role');
  return userRole === 'ADMIN';
}

// GET: Lista todos os usuários
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
      select: { // Nunca retorne a senha
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json({ message: 'Erro ao buscar usuários.' }, { status: 500 });
  }
}

// POST: Cria um novo usuário
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const { nome, email, senha, role } = await request.json();
    if (!nome || !email || !senha || !role) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Este e-mail já está em uso.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role,
      },
    });
    
    const { senha: _, ...usuarioSeguro } = novoUsuario;
    return NextResponse.json(usuarioSeguro, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ message: 'Erro ao criar usuário.' }, { status: 500 });
  }
}
