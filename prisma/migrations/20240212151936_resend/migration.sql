/*
  Warnings:

  - Added the required column `firstName` to the `ResendContact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResendContact" ADD COLUMN     "firstName" TEXT NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
