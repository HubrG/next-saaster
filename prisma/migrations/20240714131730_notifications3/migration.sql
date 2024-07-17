/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `NotificationType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_name_key" ON "NotificationType"("name");
