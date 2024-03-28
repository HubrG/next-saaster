/*
  Warnings:

  - You are about to drop the column `image` on the `SaasSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SaasSettings" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "appSettings" ADD COLUMN     "image" TEXT DEFAULT '';
