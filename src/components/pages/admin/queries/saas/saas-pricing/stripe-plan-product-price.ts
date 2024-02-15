"use server";

import { StripeManager } from "@/src/components/pages/admin/classes/stripeManager";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { createPlan, getPlan } from "@/src/helpers/utils/plans";
import { getSaasSettings } from "@/src/helpers/utils/saasSettings";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { iPlan } from "@/src/types/iPlans";
import { PlanToFeature, SaasTypes } from "@prisma/client";
const stripeManager = new StripeManager();

export const createNewPlan = async (
  saasType: SaasTypes
): Promise<{
  success?: boolean;
  plan?: iPlan;
  features?: PlanToFeature[];
  error?: string;
}> => {
  const session = await isSuperAdmin();
  if (!session) return { error: "You are not authorized" };
  try {
    const saasSettings = await getSaasSettings();
    if (saasSettings.error) throw new Error(saasSettings.error);
    const newPlan = await createPlan({
      name: "New plan",
      description: "New plan description",
      saasType: saasType,
    });
    if (!newPlan) throw new Error("Error creating plan");
    const newProduct = await stripeManager.createOrUpdateProduct({
      saasType: saasType,
      type: "create",
      name: "New plan",
      description: "New plan description",
      currency: saasSettings.data.currency,
      planId: newPlan.data.id,
    });
    if (newProduct.error) throw new Error(newProduct.error);
    const retrievePlan = await getPlan(newPlan.data.id);
    if (retrievePlan.error) throw new Error(retrievePlan.error);

    return {
      success: true,
      plan: retrievePlan.data,
      features: retrievePlan.data.Features,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const deleteNewPlan = async (
  planId: string
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const deletePlan = await prisma.plan.delete({
      where: { id: planId },
    });
    if (!deletePlan) throw new Error("Error deleting plan");
    return { success: true, data: deletePlan };
  } catch (error) {
    return { error: "Error deleting plan" };
  }
};
