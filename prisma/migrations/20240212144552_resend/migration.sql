/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ResendAudience` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `ResendContact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResendAudience_name_key" ON "ResendAudience"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResendContact_email_key" ON "ResendContact"("email");
