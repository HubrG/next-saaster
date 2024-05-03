"use server";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { verifySecretRequest } from "@/src/helpers/functions/verifySecretRequest";
import { prisma } from "@/src/lib/prisma";
import { ActionError } from "@/src/lib/safe-actions";
import {
  SaasSettings,
  appSettings
} from "@prisma/client";


// SECTION Add New  Feature


export const updateAppSettings = async (settingsId: string, data: any, chosenSecret:string) => {
   if (!chosenSecret || !verifySecretRequest(chosenSecret)) {
     throw new ActionError("Unauthorized");
   }
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: data,
  });

  for (const key of Object.keys(data)) {
    if (
      data[key] !== undefined &&
      updateSetting[key as keyof appSettings] !== data[key]
    ) {
      return false;
    }
  }

  return updateSetting;
};

export const updateSaasSettings = async (settingsId: string, data: any, chosenSecret: string) => {
  if (!chosenSecret || !verifySecretRequest(chosenSecret)) {
    throw new ActionError("Unauthorized");
  }
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateSetting = await prisma.saasSettings.update({
    where: { id: settingsId },
    data: data,
  });

  for (const key of Object.keys(data)) {
    if (
      data[key] !== undefined &&
      updateSetting[key as keyof SaasSettings] !== data[key]
    ) {
      return false;
    }
  }

  return updateSetting;
};
