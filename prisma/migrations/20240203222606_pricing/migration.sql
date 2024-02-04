-- CreateTable
CREATE TABLE "MRRSUserFeatures" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "creditCost" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MRRSUserFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MRRSUserFeatures_userId_featureId_planId_key" ON "MRRSUserFeatures"("userId", "featureId", "planId");

-- AddForeignKey
ALTER TABLE "MRRSUserFeatures" ADD CONSTRAINT "MRRSUserFeatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRRSUserFeatures" ADD CONSTRAINT "MRRSUserFeatures_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "MRRSFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRRSUserFeatures" ADD CONSTRAINT "MRRSUserFeatures_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
