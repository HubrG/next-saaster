-- DropForeignKey
ALTER TABLE "OneTimePayment" DROP CONSTRAINT "OneTimePayment_userId_fkey";

-- AddForeignKey
ALTER TABLE "OneTimePayment" ADD CONSTRAINT "OneTimePayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
