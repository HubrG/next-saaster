-- AlterTable
ALTER TABLE "StripePrice" ADD COLUMN     "transform_quantity" JSONB,
ADD COLUMN     "transform_quantity_divide_by" INTEGER,
ADD COLUMN     "transform_quantity_round" TEXT;
