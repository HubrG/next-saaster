-- AlterTable
ALTER TABLE "MRRSPlan" ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SaasSettings" ALTER COLUMN "creditName" SET DEFAULT 'Credit name';
