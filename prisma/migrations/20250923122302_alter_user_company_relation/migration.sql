/*
  Warnings:

  - You are about to drop the column `empresaId` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_empresaId_fkey";

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "empresaId";

-- CreateTable
CREATE TABLE "public"."_EmpresaToUsuario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmpresaToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EmpresaToUsuario_B_index" ON "public"."_EmpresaToUsuario"("B");

-- AddForeignKey
ALTER TABLE "public"."_EmpresaToUsuario" ADD CONSTRAINT "_EmpresaToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EmpresaToUsuario" ADD CONSTRAINT "_EmpresaToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
