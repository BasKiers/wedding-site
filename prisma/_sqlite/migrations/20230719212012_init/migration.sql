/*
  Warnings:

  - Added the required column `type` to the `RSVPSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RSVPSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_RSVPSubmission" ("createdAt", "email", "id", "updatedAt") SELECT "createdAt", "email", "id", "updatedAt" FROM "RSVPSubmission";
DROP TABLE "RSVPSubmission";
ALTER TABLE "new_RSVPSubmission" RENAME TO "RSVPSubmission";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
