"use server";

import { getFeatures } from "@/src/helpers/db/features.action";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { iFeature } from "@/src/types/iFeatures";
import { iFeaturesCategories } from "@/src/types/iFeaturesCategories";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { Feature, FeatureCategory } from "@prisma/client";


export const updateFeaturePosition = async (features: iFeature[]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateOperations = features.map((feature) =>
    prisma.feature.update({
      where: { id: feature.id },
      data: { position: feature.position },
    })
  );
  try {
    await prisma.$transaction(updateOperations);
    const features = (await getFeatures()).success
    console.log("features", features)
    return features;
  } catch (error) {
    console.error("Error updating feature positions in transaction:", error);
    return false;
  }
};

export const updateFeatureCategoryPosition = async (
  categories: iFeaturesCategories[]
) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateOperations = categories.map((category) =>
    prisma.featureCategory.update({
      where: { id: category.id },
      data: { position: category.position },
    })
  );

  try {
    await prisma.$transaction(updateOperations);

    return prisma.featureCategory.findMany();
  } catch (error) {
    console.error("Error updating categories positions in transaction:", error);
    return false;
  }
};

export const updateLinkPlanToFeature = async (
  dataToUpdate: iPlanToFeature[]
) => {
  try {
    const session = await isSuperAdmin();
    if (!session) throw new Error("Unauthorized access");

    const updateOperations = dataToUpdate.map((data) =>
      prisma.planToFeature.update({
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
      return prisma.planToFeature.findMany({
        where: {
          planId: dataToUpdate[0].planId,
        },
        include: {
          plan: true,
          feature: true,
        },
      }) as Promise<iPlanToFeature[]>;
  } catch (error) {
    console.error("Error updating multiple links:", error);
    throw error;
  }
};

type CreateNewCategory = {
  name: FeatureCategory["name"];
  featureId: Feature["id"];
};
export const createNewCategoryFromFeature = async (data: CreateNewCategory) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const newCategory = await prisma.featureCategory.create({
    data: {
      name: data.name ?? "",
    },
    include: {
      Features: true,
    }
  });

  if (!newCategory) return false;
  const linkFeatureToCategory = await prisma.feature.update({
    where: { id: data.featureId },
    data: {
      categoryId: newCategory.id,
    },
  });
  if (!linkFeatureToCategory) return false;

  return newCategory;
};

export const createNewCategory = async (name: FeatureCategory["name"]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const newCategory = await prisma.featureCategory.create({
    data: {
      name: name ?? "",
    },
  });

  return newCategory as iFeaturesCategories;
};


export const addNewMMRSFeature = async () => {
  const session = await isSuperAdmin();
  if (!session) return false;
  // Créer une nouvelle fonctionnalité
  const newFeature = await prisma.feature.create({
    data: {},
  });

  // Récupérer tous les plans actifs
  const plans = await prisma.plan.findMany();

  // Créer des liens avec tous les plans actifs
  const newFeatures = await Promise.all(
    plans.map((plan) =>
      prisma.planToFeature.create({
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

export const updateFeature = async (featureId: string, data: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const { Plans, categoryId, userUsage, ...featureData } = data;

  let relationUpdate = {};
  if (categoryId !== undefined) {
    relationUpdate = categoryId
      ? { category: { connect: { id: categoryId } } }
      : { category: { disconnect: true } };
  }

  const updateFeature = await prisma.feature.update({
    where: { id: featureId },
    data: {
      ...featureData,
      ...relationUpdate,
    },
  });

  return updateFeature;
};

export const updateFeatureCategory = async (categoryId: string, data: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateCategory = await prisma.featureCategory.update({
    where: { id: categoryId },
    data: data,
    include: {
      Features: true,
    },
  });

  return updateCategory;
};

export const deleteFeatureCategory = async (categoryId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const deleteCategory = await prisma.featureCategory.delete({
    where: { id: categoryId },
    include: {
      Features: true,
    },
  });

  return deleteCategory;
};
