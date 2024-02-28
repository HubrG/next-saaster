/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "stripeSubscriptionId";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");
