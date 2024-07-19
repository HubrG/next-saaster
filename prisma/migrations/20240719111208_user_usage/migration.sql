-- AlterTable
ALTER TABLE "UserUsage" ADD COLUMN     "planToFeatureId" TEXT;

-- AddForeignKey
ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_planToFeatureId_fkey" FOREIGN KEY ("planToFeatureId") REFERENCES "PlanToFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
