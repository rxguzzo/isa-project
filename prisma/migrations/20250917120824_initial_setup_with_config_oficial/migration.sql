/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Empresa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razaoSocial]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cnpj` on table `Empresa` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Empresa" DROP CONSTRAINT "Empresa_usuarioId_fkey";

-- AlterTable
ALTER TABLE "public"."Empresa" DROP COLUMN "usuarioId",
ADD COLUMN     "emailContato" TEXT,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "nomeFantasia" TEXT,
ADD COLUMN     "telefone" TEXT,
ALTER COLUMN "cnpj" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Problema" ALTER COLUMN "consentimentoLGPD" DROP DEFAULT,
ALTER COLUMN "disponibilidadeVisita" DROP DEFAULT,
ALTER COLUMN "areaDemanda" SET NOT NULL,
ALTER COLUMN "areaDemanda" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "empresaId" TEXT,
ALTER COLUMN "nome" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USUARIO';

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_razaoSocial_key" ON "public"."Empresa"("razaoSocial");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
