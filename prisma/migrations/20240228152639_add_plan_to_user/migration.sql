-- AlterTable
ALTER TABLE "OneTimePayment" ADD COLUMN     "priceId" TEXT;

-- AddForeignKey
ALTER TABLE "OneTimePayment" ADD CONSTRAINT "OneTimePayment_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "StripePrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
