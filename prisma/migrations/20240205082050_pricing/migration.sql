-- AlterTable
ALTER TABLE "StripeProduct" ADD COLUMN     "plan" TEXT;

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_plan_fkey" FOREIGN KEY ("plan") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
