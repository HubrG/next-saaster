-- DropForeignKey
ALTER TABLE "StripePrice" DROP CONSTRAINT "StripePrice_product_fkey";

-- AddForeignKey
ALTER TABLE "StripePrice" ADD CONSTRAINT "StripePrice_product_fkey" FOREIGN KEY ("product") REFERENCES "StripeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
