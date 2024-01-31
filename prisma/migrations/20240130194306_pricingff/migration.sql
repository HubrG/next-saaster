/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MRRSFeatureCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MRRSFeatureCategory" ALTER COLUMN "name" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "MRRSFeatureCategory_name_key" ON "MRRSFeatureCategory"("name");
