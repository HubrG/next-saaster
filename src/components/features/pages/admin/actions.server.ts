"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  appSettings,
} from "@prisma/client";

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

  const features = await prisma.mRRSFeature.findMany();

  const newFeatures = await Promise.all(
    features.map((feature) =>
      prisma.mRRSPlanToFeature.create({
        data: {
          planId: newPlan.id,
          featureId: feature.id,
        },
      })
    )
  );
  return { newPlan: newPlan, newFeatures: newFeatures };
};

export const addNewMMRSFeature = async () => {
  // Créer une nouvelle fonctionnalité
  const newFeature = await prisma.mRRSFeature.create({
    data: {},
  });

  // Récupérer tous les plans actifs
  const plans = await prisma.mRRSPlan.findMany();

  // Créer des liens avec tous les plans actifs
  const newFeatures = await Promise.all(
    plans.map((plan) =>
      prisma.mRRSPlanToFeature.create({
        data: {
          planId: plan.id,
          featureId: newFeature.id,
        },
        include: {
          plan: true,
          feature: true,
        },
      })
    )
  );

  return { newFeature: newFeature, newFeatures: newFeatures };
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

  const { MRRSPlans, categoryId, ...featureData } = data;

  let relationUpdate = {};
  if (categoryId !== undefined) {
    relationUpdate = categoryId
      ? { category: { connect: { id: categoryId } } }
      : { category: { disconnect: true } };
  }

  const updateFeature = await prisma.mRRSFeature.update({
    where: { id: featureId },
    data: {
      ...featureData,
      ...relationUpdate,
    },
  });

  return updateFeature;
};

export const updateMRRSFeatureCategory = async (
  categoryId: string,
  data: any
) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateCategory = await prisma.mRRSFeatureCategory.update({
    where: { id: categoryId },
    data: data,
  });

  return updateCategory;
};

export const deleteMRRSFeatureCategory = async (categoryId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const deleteCategory = await prisma.mRRSFeatureCategory.delete({
    where: { id: categoryId },
  });

  return deleteCategory;
}

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

  const updateOperations = plans.map((plan) =>
    prisma.mRRSPlan.update({
      where: { id: plan.id },
      data: { position: plan.position },
    })
  );

  try {
    await prisma.$transaction(updateOperations);

    return prisma.mRRSPlan.findMany();
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des positions des plans :",
      error
    );
    return false;
  }
};

export const updateMRRSFeaturePosition = async (features: MRRSFeature[]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateOperations = features.map((feature) =>
    prisma.mRRSFeature.update({
      where: { id: feature.id },
      data: { position: feature.position },
    })
  );

  try {
    await prisma.$transaction(updateOperations);

    return prisma.mRRSFeature.findMany();
  } catch (error) {
    console.error("Error updating feature positions in transaction:", error);
    return false;
  }
};

export const updateMRRSFeatureCategoryPosition = async (
  categories: MRRSFeatureCategory[]
) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateOperations = categories.map((category) =>
    prisma.mRRSFeatureCategory.update({
      where: { id: category.id },
      data: { position: category.position },
    })
  );

  try {
    await prisma.$transaction(updateOperations);

    return prisma.mRRSFeatureCategory.findMany();
  } catch (error) {
    console.error("Error updating categories positions in transaction:", error);
    return false;
  }
};

export const updateLinkPlanToFeature = async (
  dataToUpdate: MRRSPlanToFeatureWithPlanAndFeature[]
) => {
  try {
    const session = await isSuperAdmin();
    if (!session) throw new Error("Unauthorized access");

    const updateOperations = dataToUpdate.map((data) =>
      prisma.mRRSPlanToFeature.update({
        where: {
          planId_featureId: {
            planId: data.planId,
            featureId: data.featureId,
          },
        },
        data: {
          active: data.active,
          creditCost: data.creditCost,
          creditAllouedByMonth: data.creditAllouedByMonth,
        },
      })
    );
    await prisma.$transaction(updateOperations);
    if (updateOperations.length > 0)
      return prisma.mRRSPlanToFeature.findMany({
        where: {
          planId: dataToUpdate[0].planId,
        },
        include: {
          plan: true,
          feature: true,
        },
      }) as Promise<MRRSPlanToFeatureWithPlanAndFeature[]>;
  } catch (error) {
    console.error("Error updating multiple links:", error);
    throw error;
  }
};

type CreateNewCategory = {
  name: MRRSFeatureCategory["name"];
  featureId: MRRSFeature["id"];
};
export const createNewCategoryFromFeature = async (data: CreateNewCategory) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const newCategory = await prisma.mRRSFeatureCategory.create({
    data: {
      name: data.name ?? "",
    },
  });

  if (!newCategory) return false;
  const linkFeatureToCategory = await prisma.mRRSFeature.update({
    where: { id: data.featureId },
    data: {
      categoryId: newCategory.id,
    },
  });
  if (!linkFeatureToCategory) return false;

  return newCategory;
};

export const createNewCategory = async (name: MRRSFeatureCategory["name"]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const newCategory = await prisma.mRRSFeatureCategory.create({
    data: {
      name: name ?? "",
    },
  });

  return newCategory;
}
