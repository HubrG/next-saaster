"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { iPlan } from "@/src/types/iPlans";
import { Feature, Plan } from "@prisma/client";
import Stripe from "stripe";
import { getFeatures } from "./features";

export const getPlans = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        position: "asc",
      },
      include: {
        Features: {
          include: {
            feature: true,
          },
        },
        StripeProduct: {
          include: {
            prices: true,
          },
        },
        coupons: {
          include: {
            coupon: true,
          },
        },
      },
    });
    if (!plans) throw new Error("No app settings found");
    return { success: true, data: plans as Plan[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getPlan = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const plan = await prisma.plan.findFirst({
      where: {
        OR: [{ stripeId: id }, { id: id }],
      },
      include: {
        Features: {
          include: {
            feature: true,
          },
        },
        StripeProduct: {
          include: {
            prices: true,
          },
        },
        coupons: {
          include: {
            coupon: true,
          },
        },
      },
    });
    if (!plan) throw new Error("No plan found");
    return { success: true, data: plan as iPlan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createPlan = async (
  data: Partial<Plan>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        saasType: data.saasType,
        stripeId: data.stripeId ?? null,
      },
    });
    if (!plan) throw new Error("An error has occured while creating the plan");
    const linkFeatures = await getFeatures();
    if (!linkFeatures.success) throw new Error(linkFeatures.error);
    const newFeatures = await Promise.all(
      linkFeatures.data.map((feature: Feature) =>
        prisma.planToFeature.create({
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
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const updatePlan = async (
  data: Partial<Plan>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const existingPlan = await prisma.plan.findFirst({
      where: {
        OR: [{ stripeId: data.id }, { id: data.id }],
      },
    });
    if (!existingPlan) throw new Error("Plan not found");
    const plan = await prisma.plan.update({
      where: { id: existingPlan.id },
      data: data,
    });
    return { success: true, data: plan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

type DeletePlanData = {
  id: string;
  type?: "stripe";
};
export const deletePlan = async ({
  id,
  type,
}: DeletePlanData): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    if (type === "stripe") {
      const plan = await prisma.plan.delete({
        where: { stripeId: id },
      });
      if (!plan)
        throw new Error("An error has occured while deleting the plan");
      return { success: true, data: plan };
    }
    const plan = await prisma.plan.delete({
      where: { id: id },
    });
    if (!plan) throw new Error("An error has occured while deleting the plan");
    return { success: true, data: plan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createOrUpdatePlanStripeToBdd = async (
  type: "create" | "update",
  stripePlan: Stripe.Product
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const planData = {
      ...stripePlan,
      active: stripePlan.active,
      stripeId: stripePlan.id,
      name: stripePlan.name,
      description: stripePlan.description,
    };
    if (type === "create") {
      const plan = await createPlan(planData as Partial<Plan>);
      return { success: true, data: plan };
    } else if (type === "update") {
      const plan = await updatePlan(planData as Partial<Plan>);
      return { success: true, data: plan };
    } else {
      console.error("An unknown error occurred");
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
