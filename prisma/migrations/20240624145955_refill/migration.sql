-- AlterTable
ALTER TABLE "SaasSettings" ADD COLUMN     "activeDiscountRefillCredit" BOOLEAN DEFAULT false,
ADD COLUMN     "applyDiscountByXRefillCreditStep" INTEGER DEFAULT 0,
ADD COLUMN     "discountForRefillCredit" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "maxRefillCredit" INTEGER DEFAULT 100,
ADD COLUMN     "priceForOneRefillCredit" DOUBLE PRECISION DEFAULT 1,
ADD COLUMN     "refillCreditStep" INTEGER DEFAULT 10;
