/*
  Warnings:

  - You are about to drop the column `created` on the `StripePrice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripePrice" DROP COLUMN "created",
ADD COLUMN     "billing_scheme" TEXT,
ADD COLUMN     "custom_unit_amount" TEXT,
ADD COLUMN     "lookup_key" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "recurring_aggregate_usage" INTEGER,
ADD COLUMN     "recurring_interval" TEXT,
ADD COLUMN     "recurring_interval_count" INTEGER,
ADD COLUMN     "recurring_trial_period_days" INTEGER,
ADD COLUMN     "recurring_usage_type" TEXT,
ADD COLUMN     "tiers_mode" TEXT,
ALTER COLUMN "recurring" DROP NOT NULL;
