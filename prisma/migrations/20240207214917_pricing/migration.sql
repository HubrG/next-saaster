/*
  Warnings:

  - The primary key for the `StripePlanCoupon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[MRRSPlanId,couponId]` on the table `StripePlanCoupon` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `StripePlanCoupon` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "StripePlanCoupon" DROP CONSTRAINT "StripePlanCoupon_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "StripePlanCoupon_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "StripePlanCoupon_MRRSPlanId_couponId_key" ON "StripePlanCoupon"("MRRSPlanId", "couponId");
