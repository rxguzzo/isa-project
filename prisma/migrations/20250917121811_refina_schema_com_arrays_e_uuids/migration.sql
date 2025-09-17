/*
  Warnings:

  - The `areaDemanda` column on the `Problema` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Problema" ALTER COLUMN "consentimentoLGPD" SET DEFAULT false,
ALTER COLUMN "disponibilidadeVisita" SET DEFAULT false,
DROP COLUMN "areaDemanda",
ADD COLUMN     "areaDemanda" TEXT[];

-- AlterTable
ALTER TABLE "public"."Usuario" ALTER COLUMN "role" SET DEFAULT 'USER';
