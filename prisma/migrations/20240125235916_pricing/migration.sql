/*
  Warnings:

  - The values [MRR_COMPLEXE] on the enum `SaasTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SaasTypes_new" AS ENUM ('CREDIT', 'MRR_SIMPLE', 'PAY_ONCE');
ALTER TABLE "SaasSettings" ALTER COLUMN "saasType" DROP DEFAULT;
ALTER TABLE "MRRSPlan" ALTER COLUMN "saasType" DROP DEFAULT;
ALTER TABLE "SaasSettings" ALTER COLUMN "saasType" TYPE "SaasTypes_new" USING ("saasType"::text::"SaasTypes_new");
ALTER TABLE "MRRSPlan" ALTER COLUMN "saasType" TYPE "SaasTypes_new" USING ("saasType"::text::"SaasTypes_new");
ALTER TYPE "SaasTypes" RENAME TO "SaasTypes_old";
ALTER TYPE "SaasTypes_new" RENAME TO "SaasTypes";
DROP TYPE "SaasTypes_old";
ALTER TABLE "SaasSettings" ALTER COLUMN "saasType" SET DEFAULT 'MRR_SIMPLE';
ALTER TABLE "MRRSPlan" ALTER COLUMN "saasType" SET DEFAULT 'MRR_SIMPLE';
COMMIT;