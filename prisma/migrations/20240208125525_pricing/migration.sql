/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `MRRSPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[MRRSPlanId]` on the table `StripeProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MRRSPlan_stripeId_key" ON "MRRSPlan"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_MRRSPlanId_key" ON "StripeProduct"("MRRSPlanId");
