// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@isa.com'; // <-- COLOQUE SEU EMAIL AQUI
  const adminPassword = 'senha-forte-123'; // <-- COLOQUE SUA SENHA AQUI

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Usuário admin já existe.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.create({
    data: {
      email: adminEmail,
      senha: hashedPassword,
    },
  });
  console.log('Usuário admin criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });