/*
  Warnings:

  - You are about to drop the column `summary` on the `news` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_news" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exhibitionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "news_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_news" ("createdAt", "exhibitionId", "id", "publishedAt", "source", "title", "url") SELECT "createdAt", "exhibitionId", "id", "publishedAt", "source", "title", "url" FROM "news";
DROP TABLE "news";
ALTER TABLE "new_news" RENAME TO "news";
CREATE UNIQUE INDEX "news_url_key" ON "news"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
