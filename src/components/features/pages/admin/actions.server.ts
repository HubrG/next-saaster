"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { SaasSettings, appSettings } from "@prisma/client";


// export const getFeatureCategories = async () => {
//   const session = await isAdmin();
//   if (!session) return false;
//   const categories = await prisma.pricingFeatureCategory.findMany();
//   return categories || null;
// };


export const addNewMRRSPlan = async () => {
  const newPlan = await prisma.mRRSPlan.create({
    data: {},
  });
  return newPlan;
};

export const updateMRRSPlan = async (planId: string, data: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const updatePlan = await prisma.mRRSPlan.update({
    where: { id: planId },
    data: data,
  });
  return updatePlan;
};

export const updateAppSettings = async (settingsId: string, data: any) => {
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

export const updateSaasSettings = async (settingsId: string, data: any) => {
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

