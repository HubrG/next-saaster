"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { MRRSPlan, SaasSettings, appSettings } from "@prisma/client";


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

export const addNewMMRSFeature = async () => {
  const newFeature = await prisma.mRRSFeature.create({
    data: {},
  });
  return newFeature;
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

export const updateMRRSFeature = async (featureId: string, data: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const updateFeature = await prisma.mRRSFeature.update({
    where: { id: featureId },
    data: data,
  });
  return updateFeature;
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

export const updateMRRSPlanPosition = async (plans: MRRSPlan[]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updatePromises = plans.map((plan) =>
    prisma.mRRSPlan.update({
      where: { id: plan.id },
      data: { position: plan.position },
    })
  );

  try {
    await Promise.all(updatePromises);
    return prisma.mRRSPlan.findMany();
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des positions des plans :",
      error
    );
    return false;
  }
};

export const updateMRRSFeaturePosition = async (features: any[]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updatePromises = features.map((feature) =>
    prisma.mRRSFeature.update({
      where: { id: feature.id },
      data: { position: feature.position },
    })
  );

  try {
    await Promise.all(updatePromises);
    return prisma.mRRSFeature.findMany();
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des positions des features :",
      error
    );
    return false;
  }
}