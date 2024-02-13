"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { MRRSFeature, MRRSPlan } from "@prisma/client";
import { getFeatures } from "./features";

export const getPlans = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const plans = await prisma.mRRSPlan.findMany({
      orderBy: {
        position: "asc",
      },
    });
    if (!plans) throw new Error("No app settings found");
    return { success: true, data: plans as MRRSPlan[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createPlan = async (
  data: Partial<MRRSPlan>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const plan = await prisma.mRRSPlan.create({
      data: {
        name: data.name,
        description: data.description,
        stripeId: data.id,
      },
    });
    if (!plan) throw new Error("An error has occured while creating the plan");
    const linkFeatures = await getFeatures();
    if (!linkFeatures.success) throw new Error(linkFeatures.error);
    const newFeatures = await Promise.all(
      linkFeatures.data.map((feature: MRRSFeature) =>
        prisma.mRRSPlanToFeature.create({
          data: {
            planId: plan?.id,
            featureId: feature.id,
          },
        })
      )
    );
    if (!newFeatures)
      throw new Error(
        "An error has occured while linking features to the plan"
      );
    return { success: true, data: plan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updatePlan = async (
  data: Partial<MRRSPlan>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const plan = await prisma.mRRSPlan.update({
      where: { stripeId: data.id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    if (!plan) throw new Error("An error has occured while updating the plan");
    return { success: true, data: plan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const deletePlan = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const plan = await prisma.mRRSPlan.delete({
      where: { stripeId: id },
    });
    if (!plan) throw new Error("An error has occured while deleting the plan");
    return { success: true, data: plan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
