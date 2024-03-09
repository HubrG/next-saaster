"use server";

import {
  createFeature,
  getFeatures,
  updateFeature,
} from "@/src/helpers/db/features.action";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";

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

export const addNewMMRSFeature = async () => {
  // Créer une nouvelle fonctionnalité
  const newFeature = await createFeature();
  if (newFeature.serverError) {
    throw new Error(newFeature.serverError);
  }
  const newFeatureData = newFeature.data?.success;
  console.log("newFeatureData", newFeatureData);
  if (!newFeatureData) {
    throw new Error("Error creating new feature");
  }
  // Récupérer tous les plans actifs
  const plans = await prisma.plan.findMany();

  // Créer des liens avec tous les plans actifs
  const newFeatures = await Promise.all(
    plans.map((plan) =>
      prisma.planToFeature.create({
        data: {
          planId: plan.id,
          featureId: newFeatureData?.id,
        },
        include: {
          plan: true,
          feature: true,
        },
      })
    )
  );

  return { newFeature: newFeatureData, newFeatures: newFeatures };
};

export const dbGetFeatures = async () => {
  const features = await getFeatures();
  return features;
};

export const dbUpdateFeature = async ({ data }: { data: any }) => {
  const update = await updateFeature({
    data,
  });
  return update;
};

export const dbUpdateFeatureAll = async ({
  data,
  newSaasFeatures,
}: {
  data?: any;
  newSaasFeatures: any;
}) => {
  const updatePromises = newSaasFeatures.map((feature: any) =>
    dbUpdateFeature({
      data: {
        id: feature.id,
        position: feature.position ?? 9999,
      },
    })
  );
  const results = await Promise.all(updatePromises);
  return results;
};
