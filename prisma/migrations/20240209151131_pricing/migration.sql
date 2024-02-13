/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SaasTypes" ADD VALUE 'FIXED_RATE';
ALTER TYPE "SaasTypes" ADD VALUE 'METERED_USAGE';
ALTER TYPE "SaasTypes" ADD VALUE 'PER_SEAT';
ALTER TYPE "SaasTypes" ADD VALUE 'TIERED_PRICING';
ALTER TYPE "SaasTypes" ADD VALUE 'VOLUME_PRICING';
ALTER TYPE "SaasTypes" ADD VALUE 'COMBINED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedPassword",
ADD COLUMN     "password" TEXT;
