/*
  Warnings:

  - You are about to drop the column `last_name` on the `ResendContact` table. All the data in the column will be lost.
  - You are about to drop the `ResendAudienceToContact` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lastName` to the `ResendContact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ResendAudienceToContact" DROP CONSTRAINT "ResendAudienceToContact_audienceId_fkey";

-- DropForeignKey
ALTER TABLE "ResendAudienceToContact" DROP CONSTRAINT "ResendAudienceToContact_contactId_fkey";

-- AlterTable
ALTER TABLE "ResendContact" DROP COLUMN "last_name",
ADD COLUMN     "audienceId" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "ResendAudienceToContact";

-- AddForeignKey
ALTER TABLE "ResendContact" ADD CONSTRAINT "ResendContact_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "ResendAudience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResendContact" ADD CONSTRAINT "ResendContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
