-- AlterTable
ALTER TABLE "MRRSFeature" ADD COLUMN     "positionCategory" INTEGER DEFAULT 9999,
ALTER COLUMN "position" SET DEFAULT 9999;

-- AlterTable
ALTER TABLE "MRRSFeatureCategory" ALTER COLUMN "position" SET DEFAULT 9999;

-- AlterTable
ALTER TABLE "MRRSPlan" ALTER COLUMN "position" SET DEFAULT 9999;