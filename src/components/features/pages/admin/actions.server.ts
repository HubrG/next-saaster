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
  // Créer un nouveau plan
  const newPlan = await prisma.mRRSPlan.create({
    data: {},
  });

  // Récupérer toutes les fonctionnalités actives
  const features = await prisma.mRRSFeature.findMany();

  // Créer des liens avec toutes les fonctionnalités actives
  await Promise.all(
    features.map((feature) =>
      prisma.mRRSPlanToFeature.create({
        data: {
          planId: newPlan.id,
          featureId: feature.id,
        },
      })
    )
  );

  return newPlan;
};


export const addNewMMRSFeature = async () => {
  // Créer une nouvelle fonctionnalité
  const newFeature = await prisma.mRRSFeature.create({
    data: {},
  });

  // Récupérer tous les plans actifs
  const plans = await prisma.mRRSPlan.findMany();

  // Créer des liens avec tous les plans actifs
  await Promise.all(
    plans.map((plan) =>
      prisma.mRRSPlanToFeature.create({
        data: {
          planId: plan.id,
          featureId: newFeature.id,
        },
      })
    )
  );

  return newFeature;
};



export const updateMRRSPlan = async (planId: string, planData: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  // Exclure les données de relation de l'objet 'planData'
  const { MRRSFeatures, ...filteredPlanData } = planData;

  // Mettre à jour le plan avec les données filtrées (sans les données de relation)
  const updatePlan = await prisma.mRRSPlan.update({
    where: { id: planId },
    data: filteredPlanData,
  });

  return updatePlan;
};


export const updateMRRSFeature = async (featureId: string, data: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  // Exclure les données de la relation 'MRRSPlans' de l'objet 'data'
  const { MRRSPlans, ...featureData } = data;

  // Mettre à jour la feature avec les données filtrées (sans les données de relation)
  const updateFeature = await prisma.mRRSFeature.update({
    where: { id: featureId },
    data: featureData,
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