/*
  Warnings:

  - The `areaDemanda` column on the `Problema` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Problema" DROP COLUMN "areaDemanda",
ADD COLUMN     "areaDemanda" TEXT[];

-- CreateTable
CREATE TABLE "public"."ConfiguracaoGlobal" (
    "id" TEXT NOT NULL,
    "notificacoesAtivas" BOOLEAN NOT NULL DEFAULT true,
    "modoManutencao" BOOLEAN NOT NULL DEFAULT false,
    "mensagemBoasVindas" TEXT,
    "minVersaoAppRequerida" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracaoGlobal_pkey" PRIMARY KEY ("id")
);
