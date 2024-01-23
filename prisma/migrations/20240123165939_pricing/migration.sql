-- AlterTable
ALTER TABLE "appSettings" ALTER COLUMN "theme" SET DEFAULT 'nanny',
ALTER COLUMN "roundedCorner" SET DEFAULT 5;

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isCustom" BOOLEAN DEFAULT false,
    "isPopular" BOOLEAN DEFAULT false,
    "isRecommended" BOOLEAN DEFAULT false,
    "isFree" BOOLEAN DEFAULT false,
    "isTrial" BOOLEAN DEFAULT false,
    "trialDays" INTEGER DEFAULT 0,
    "monthlyPrice" INTEGER DEFAULT 0,
    "yearlyPrice" INTEGER DEFAULT 0,
    "monthlyTax" INTEGER DEFAULT 0,
    "yearlyTax" INTEGER DEFAULT 0,
    "monthlyPromotion" INTEGER DEFAULT 0,
    "yearlyPromotion" INTEGER DEFAULT 0,
    "currency" TEXT DEFAULT 'usd',
    "active" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingToFeature" (
    "id" TEXT NOT NULL,
    "pricingId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "PricingToFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PricingFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingFeatureCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PricingFeatureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingToFeature_pricingId_featureId_key" ON "PricingToFeature"("pricingId", "featureId");

-- AddForeignKey
ALTER TABLE "PricingToFeature" ADD CONSTRAINT "PricingToFeature_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingToFeature" ADD CONSTRAINT "PricingToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "PricingFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingFeature" ADD CONSTRAINT "PricingFeature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PricingFeatureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
