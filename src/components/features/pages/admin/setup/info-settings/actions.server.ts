"use server";
import { prisma } from "@/src/lib/prisma";
import { appSettings } from "@prisma/client";
import { isAdmin } from "@/src/functions/isAdmin";

type UpdateInfosApp = Pick<appSettings, "name" | "description" | "baseline">;

export const updateInfosApp = async (
  settingsId: string,
  data: UpdateInfosApp
) => {
  const session = await isAdmin();
  if (!session) return false;

  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: data,
  });

  const isUpdated =
    data.name === updateSetting.name &&
    data.description === updateSetting.description &&
    data.baseline === updateSetting.baseline;
  if (!isUpdated) return false;
  return isUpdated;
};
