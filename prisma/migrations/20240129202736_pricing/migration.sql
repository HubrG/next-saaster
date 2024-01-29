-- DropForeignKey
ALTER TABLE "MRRSPlanToFeature" DROP CONSTRAINT "MRRSPlanToFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSPlanToFeature" DROP CONSTRAINT "MRRSPlanToFeature_planId_fkey";

-- AddForeignKey
ALTER TABLE "MRRSPlanToFeature" ADD CONSTRAINT "MRRSPlanToFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRRSPlanToFeature" ADD CONSTRAINT "MRRSPlanToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "MRRSFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
