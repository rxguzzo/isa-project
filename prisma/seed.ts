// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@isa.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    throw new Error('Defina ADMIN_PASSWORD (mínimo 12 caracteres) no .env antes de rodar o seed.');
  }

  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Usuário admin já existe.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.usuario.create({
    data: {
      email: adminEmail,
      senha: hashedPassword,
      nome: 'Administrador ISA',
      role: 'ADMIN',
    },
  });
  console.log('Usuário admin (do tipo Usuario) criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });