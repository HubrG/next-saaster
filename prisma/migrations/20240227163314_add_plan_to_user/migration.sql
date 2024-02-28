-- AlterTable
ALTER TABLE "User" ADD COLUMN     "priceId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "StripePrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
