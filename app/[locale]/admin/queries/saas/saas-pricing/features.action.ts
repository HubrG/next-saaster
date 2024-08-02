"use server";

import {
  createFeature,
  getFeatures,
  updateFeature,
} from "@/src/helpers/db/features.action";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import {
  chosenSecret,
  verifySecretRequest,
} from "@/src/helpers/functions/verifySecretRequest";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { adminAction } from "@/src/lib/safe-actions";
import { iFeature } from "@/src/types/db/iFeatures";
import { iPlanToFeature } from "@/src/types/db/iPlanToFeature";
import { updateFeatureSchema } from "@/src/types/schemas/dbSchema";

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
  const session = await isSuperAdmin();
  if (!session) throw new Error("Unauthorized access");
  // Créer une nouvelle fonctionnalité
  const newFeature = await createFeature();
  if (newFeature.serverError) {
    throw new Error(newFeature.serverError);
  }
  const newFeatureData = newFeature.data?.success;

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
  const features = await getFeatures({ secret: chosenSecret() });
  return features;
};

export const dbUpdateFeature = adminAction(
  updateFeatureSchema,
  async ({ data, secret }): Promise<HandleResponseProps<iFeature>> => {
    if (!secret || verifySecretRequest(secret) === false) {
      throw new Error("Unauthorized access");
    }
    let feature;
    try {
      // If data.alias already on another feature, throw an error
      if (data.alias) {
        const featureWithAlias = await prisma.feature.findFirst({
          where: {
            alias: data.alias,
            id: {
              not: data.id,
            },
          },
        });
        if (featureWithAlias) {
          throw new Error("Alias already used by another feature. Each feature must have a unique alias.");
        } else {
          // We update the feature
          feature = await updateFeature({ data });
        }
      } else {
        // We update the feature
        feature = await updateFeature({ data });
      }
      return handleRes<iFeature>({
        success: feature as iFeature,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeature>({ error: ActionError, statusCode: 500 });
    }
  }
);
