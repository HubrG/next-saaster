-- CreateTable
CREATE TABLE "StripeWebhook" (
    "id" TEXT NOT NULL,
    "whsec" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "StripeWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhook_whsec_key" ON "StripeWebhook"("whsec");
