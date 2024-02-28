-- AlterTable
ALTER TABLE "SaasSettings" ALTER COLUMN "activeFeatureComparison" SET DEFAULT true,
ALTER COLUMN "creditName" SET DEFAULT 'Credit';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planId" TEXT;

-- AlterTable
ALTER TABLE "appSettings" ALTER COLUMN "name" SET DEFAULT 'Fairysaas',
ALTER COLUMN "theme" SET DEFAULT 'purple',
ALTER COLUMN "roundedCorner" SET DEFAULT 10;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
