/*
  Warnings:

  - You are about to drop the `apiKeys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "apiKeys";

-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "key" TEXT,
    "secret" TEXT,
    "active" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_key_key" ON "ApiKeys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_secret_key" ON "ApiKeys"("secret");
