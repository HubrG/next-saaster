"use server";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import {
  HandleResponseProps,
  handleRes,
  handleResponse,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iFeature } from "@/src/types/iFeatures";
import { iPlan } from "@/src/types/iPlans";
import { createOrUpdatePlanStripeToBddSchema } from "@/src/types/schemas/dbSchema";
import { Plan } from "@prisma/client";
import { getFeatures } from "./features.action";
  if (action === undefined) {
    throw new Error("useActions must be used within a ActionProvider");
  }
export const getPlans = async (): Promise<{
  data?: iPlan[];
  error?: string;
}> => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
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
    if (!plans) throw new Error("No plans found");
    return handleResponse<iPlan[]>(plans);
  } catch (error) {
    return handleResponse<undefined>(undefined, error);
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
  data: Partial<iPlan>
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
      linkFeatures.success.map((feature: iFeature) =>
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
    return { success: true, data: plan as iPlan };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const updatePlan = async (
  data: Partial<iPlan>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const existingPlan = await prisma.plan.findFirst({
      where: {
        OR: [{ stripeId: data.id }, { id: data.id }],
      },
    });
    if (!existingPlan) throw new Error("Plan not found");
    const { id, Features, StripeProduct, coupons, ...updateData } = data;

    const plan = await prisma.plan.update({
      where: { id: existingPlan.id },
      data: updateData,
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
    if (!id) throw new Error("No plan id provided");
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
    return { success: true, data: plan as iPlan };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createOrUpdatePlanStripeToBdd = action(
  createOrUpdatePlanStripeToBddSchema,
  async ({
    type,
    stripePlan,
  }): Promise<HandleResponseProps<iPlan>> => {
    try {
      const planData = {
        ...stripePlan,
        active: stripePlan.active,
        stripeId: stripePlan.id,
        saasType: type === "create" ? "CUSTOM" : undefined,
        name: stripePlan.name,
        description: stripePlan.description
          ? stripePlan.description
          : "New plan description",
      };
      // NOTE : Create
      if (type === "create") {
        const plan = await createPlan(planData as Plan);
        if (!plan.data) throw new ActionError(plan.error);
        return handleRes<iPlan>({
          success: plan.data,
          statusCode: 200,
        });
        // NOTE : Update
      } else if (type === "update") {
        const plan = await updatePlan(planData as Partial<Plan>);
        if (!plan.data) throw new ActionError(plan.error);
        return handleRes<iPlan>({
          success: plan.data,
          statusCode: 200,
        });
      } else {
        throw new ActionError("An unknown error occurred");
      }
    } catch (error) {
      console.error(ActionError);
      return handleRes<iPlan>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
