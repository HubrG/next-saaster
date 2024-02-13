-- CreateTable
CREATE TABLE "ResendAudience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ResendAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResendContact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "unsubscribe" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ResendContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResendAudienceToContact" (
    "id" TEXT NOT NULL,
    "audienceId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "ResendAudienceToContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResendAudienceToContact_audienceId_contactId_key" ON "ResendAudienceToContact"("audienceId", "contactId");

-- AddForeignKey
ALTER TABLE "ResendAudienceToContact" ADD CONSTRAINT "ResendAudienceToContact_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "ResendAudience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResendAudienceToContact" ADD CONSTRAINT "ResendAudienceToContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "ResendContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
