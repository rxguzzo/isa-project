/*
  Warnings:

  - You are about to drop the column `arquivoUrl` on the `Problema` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Problema` table. All the data in the column will be lost.
  - Added the required column `areaDemanda` to the `Problema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivelUrgencia` to the `Problema` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Problema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "areaDemanda" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "objetivos" TEXT,
    "nivelUrgencia" TEXT NOT NULL,
    "orcamento" TEXT,
    "comoConheceu" TEXT,
    "consentimentoLGPD" BOOLEAN NOT NULL DEFAULT false,
    "disponibilidadeVisita" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "Problema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Problema" ("assunto", "createdAt", "descricao", "empresaId", "id", "status", "updatedAt") SELECT "assunto", "createdAt", "descricao", "empresaId", "id", "status", "updatedAt" FROM "Problema";
DROP TABLE "Problema";
ALTER TABLE "new_Problema" RENAME TO "Problema";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
