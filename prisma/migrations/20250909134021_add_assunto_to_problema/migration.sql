/*
  Warnings:

  - Added the required column `assunto` to the `Problema` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Problema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assunto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "arquivoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "Problema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Problema" ("arquivoUrl", "categoria", "createdAt", "descricao", "empresaId", "id", "status", "updatedAt") SELECT "arquivoUrl", "categoria", "createdAt", "descricao", "empresaId", "id", "status", "updatedAt" FROM "Problema";
DROP TABLE "Problema";
ALTER TABLE "new_Problema" RENAME TO "Problema";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
