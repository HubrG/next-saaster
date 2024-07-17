/*
  Warnings:

  - A unique constraint covering the columns `[typeId]` on the table `NotificationSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_typeId_key" ON "NotificationSettings"("typeId");
