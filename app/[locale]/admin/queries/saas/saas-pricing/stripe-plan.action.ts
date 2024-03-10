"use server";

import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import {
  createPlan,
  deletePlan,
  getPlan,
  getPlans,
  updatePlan as upPlan,
} from "@/src/helpers/db/plans.action";
import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import { searchPricesRaw } from "@/src/helpers/db/stripePrices.action";
import { getStripeProduct } from "@/src/helpers/db/stripeProducts.action";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { iPlan } from "@/src/types/db/iPlans";
import { iStripeProduct } from "@/src/types/db/iStripeProducts";
import { Plan, PlanToFeature, SaasTypes } from "@prisma/client";
import { toLower } from "lodash";
import Stripe from "stripe";
const stripeManager = new StripeManager();

// SECTION -> Create New Plan
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
    if (!saasSettings.data) throw new Error(saasSettings.error);
    const newPlan = await createPlan({
      data: {
        name: "New plan",
        description: "New plan description",
        saasType: saasType,
      },
    });
    if (!newPlan.data?.success) throw new Error(newPlan.serverError);
    const newProduct = await stripeManager.createOrUpdateProduct({
      saasType: saasType,
      type: "create",
      name: "New plan",
      description: "New plan description",
      currency: saasSettings.data.currency ?? "usd",
      planId: newPlan.data?.success?.id,
    });
    if (newProduct.error) {
      deleteNewPlan(newPlan.data.success.id);
      throw new Error(newProduct.error);
    }
    const retrievePlan = await getPlan({
      id: newPlan.data.success.id,
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    if (!retrievePlan.data?.success) throw new Error(retrievePlan.serverError);
    return {
      success: true,
      plan: retrievePlan.data.success,
      features: retrievePlan.data.success.Features,
    };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

// SECTION -> Update Plan
export const updatePlan = async (
  data: Plan
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    if (!data.stripeId || !data.id) throw new Error("No stripeId found");

    const initPlan = await getPlan({
      id: data.id,
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    if (handleError(initPlan).error)
      throw new Error(handleError(initPlan).message);
    const initialPlan = initPlan.data?.success;
    if (!initialPlan) throw new Error("Error getting initial plan");
    // if deleted = true, deactive the plan
    if (data.deleted) {
      data = { ...data, active: false };
    }
    if (!data.stripeId) throw new Error("No stripeId found");
    const product = (await getStripeProduct(data.stripeId)) as {
      data: iStripeProduct;
      error: string;
      success: boolean;
    };
    if (product.error) throw new Error(product.error);
    const prices = product.data.prices;
    const saasSettings = (await getSaasSettings()) as {
      data: { currency: string };
    };
    // NOTE : Pay once
    if (data.saasType === "PAY_ONCE") {
      // We verify if the plan prices has changed
      if (initialPlan.oncePrice === data.oncePrice) {
        const validUpdate = await upPlan({
          data: { ...data, active: data.active ?? false },
        });
        if (handleError(validUpdate).error)
          throw new Error(handleError(validUpdate).message);
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "PAY_ONCE"
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        return { success: true, data: validUpdate.data?.success };
      } else {
        //  We create a new price for the plan and update de default price of the product
        const newPrice = (await createNewPriceForPlan({
          data: data,
          dataToSet: {
            product: product.data.id,
            currency: saasSettings.data.currency ?? "usd",
            unit_amount: (data.oncePrice && data.oncePrice * 100) ?? 0,
          },
        })) as { data: { data: { id: string } }; error: string };
        if (newPrice.error) throw new Error(newPrice.error);
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "PAY_ONCE",
          newPrice.data.data.id
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        // We deactive others prices for the product, not the new one
        const deactivatedOldPrices = await deactivateOldPrices({
          prices,
          newPriceId: newPrice.data.data.id,
          interval: undefined,
        });
        if (deactivatedOldPrices.error)
          throw new Error(deactivatedOldPrices.error);
        const validUpdate = await upPlan({
          data: { ...data, active: data.active ?? false },
        });
        if (handleError(validUpdate).error)
          throw new Error(handleError(validUpdate).message);
        return { success: true, data: validUpdate.data?.success };
      }
    }
    // NOTE : MRR_SIMPLE | METERED_USAGE | PER_SEAT
    else if (
      data.saasType === "MRR_SIMPLE" ||
      data.saasType === "METERED_USAGE" ||
      data.saasType === "PER_SEAT"
    ) {
      // We verify if the plan prices has changed
      if (
        initialPlan.monthlyPrice === data.monthlyPrice &&
        initialPlan.yearlyPrice === data.yearlyPrice &&
        initialPlan.meteredUnit === data.meteredUnit &&
        initialPlan.meteredMode === data.meteredMode &&
        initialPlan.meteredBillingPeriod === data.meteredBillingPeriod
      ) {
        const validUpdate = await upPlan({
          data: { ...data, active: data.active ?? false },
        });
        if (handleError(validUpdate).error)
          throw new Error(handleError(validUpdate).message);
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "MRR_SIMPLE"
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        return { success: true, data: initialPlan };
      } else {
        //  We create a new price for the plan and update de default price of the product
        if (
          initialPlan.monthlyPrice !== data.monthlyPrice ||
          initialPlan.meteredUnit !== data.meteredUnit ||
          initialPlan.meteredMode !== data.meteredMode ||
          initialPlan.meteredBillingPeriod !== data.meteredBillingPeriod
        ) {
          const newPrice = (await createNewPriceForPlan({
            data: data,
            dataToSet: {
              product: product.data.id,
              currency: saasSettings.data.currency ?? "usd",
              recurring: {
                interval:
                  data.saasType === "METERED_USAGE"
                    ? (toLower(data.meteredBillingPeriod) as
                        | "week"
                        | "month"
                        | "day")
                    : "month",
                interval_count: 1,
                usage_type:
                  data.saasType === "METERED_USAGE" ? "metered" : "licensed",
                aggregate_usage:
                  data.saasType === "METERED_USAGE" ? "sum" : undefined,
              },
              transform_quantity:
                data.saasType === "METERED_USAGE" &&
                data.meteredMode === "PACKAGE"
                  ? {
                      divide_by: data.meteredUnit ?? 0,
                      round: "up",
                    }
                  : undefined,
              unit_amount:
                data.saasType === "METERED_USAGE"
                  ? undefined
                  : (data.monthlyPrice && data.monthlyPrice * 100) ?? 0,
              unit_amount_decimal:
                data.saasType === "METERED_USAGE"
                  ? `${data.monthlyPrice && data.monthlyPrice * 100}`
                  : undefined ?? undefined,
            },
          })) as { data: { data: { id: string } }; error: string };
          if (newPrice.error) throw new Error(newPrice.error);
          const { stripeYearlyPriceId, ...restOfData } = data;
          const validUpdate = await upPlan({
            data: {
              ...restOfData,
              monthlyPrice: data.monthlyPrice,
              stripeMonthlyPriceId: newPrice.data.data.id,
            },
          });
          if (handleError(validUpdate).error)
            throw new Error(handleError(validUpdate).message);
          const deactivate = await deactivateOldPrices({
            prices: prices,
            newPriceId: newPrice.data.data.id,
            interval:
              data.saasType === "METERED_USAGE"
                ? (toLower(initialPlan.meteredBillingPeriod) as
                    | "month"
                    | "week"
                    | "day"
                    | "year")
                : "month",
            oldPrice: initialPlan.monthlyPrice ?? 0,
            defaultPrice: product.data.default_price,
          });
          if (deactivate.error) throw new Error(deactivate.error);
        }
        if (initialPlan.yearlyPrice !== data.yearlyPrice) {
          const newPrice = (await createNewPriceForPlan({
            data: data,
            dataToSet: {
              product: product.data.id,
              currency: saasSettings.data.currency ?? "usd",
              recurring: {
                interval: "year",
                interval_count: 1,
              },
              unit_amount: (data.yearlyPrice && data.yearlyPrice * 100) ?? 0,
            },
          })) as { data: { data: { id: string } }; error: string };
          if (newPrice.error) throw new Error(newPrice.error);
          const { stripeMonthlyPriceId, ...restOfData } = data;
          const validUpdate = await upPlan({
            data: {
              ...restOfData,
              stripeYearlyPriceId: newPrice.data.data.id
            },
          });
          if (handleError(validUpdate).error)
            throw new Error(handleError(validUpdate).message);
        
          const deactivate = await deactivateOldPrices({
            prices: prices,
            newPriceId: newPrice.data.data.id,
            interval: "year",
            oldPrice: initialPlan.yearlyPrice ?? 0,
            defaultPrice: product.data.default_price,
          });
          if (deactivate.error) throw new Error(deactivate.error);
        }
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "MRR_SIMPLE"
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        return { success: true, data: updatedProduct.data };
      }
    }
    return { success: true, data: initialPlan };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const updatePlanPosition = async (plans: Plan[]) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const updateOperations = plans.map((plan) =>
    prisma.plan.update({
      where: { id: plan.id },
      data: { position: plan.position },
    })
  );

  try {
    await prisma.$transaction(updateOperations);
    const plans = await getPlans({ secret: process.env.NEXTAUTH_SECRET ?? "" });
    if (!plans) return false;
    return plans;
  } catch (error) {
    console.error("Error updating plan positions in transaction:", error);
    return false;
  }
};

// SECTION -> UTILS
export const deleteNewPlan = async (
  plan: iPlan["id"]
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const delPlan = await deletePlan({ id: plan });
    if (!delPlan) throw new Error("Error deleting plan");
    return { success: true, data: delPlan };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting plan" };
  }
};

const updateStripeProduct = async (
  data: Partial<iPlan>,
  product: Partial<iStripeProduct>,
  saasType: SaasTypes,
  defaultPriceId?: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  if (!data.stripeId || !data.id) throw new Error("No stripeId found");
  try {
    const dataToSend = {
      type: "update" as const,
      id: data.stripeId,
      saasType: saasType,
      name: data.name ?? product.name,
      description: data.description ?? "",
      active: data.active ?? false,
      planId: data.id,
      ...(defaultPriceId && { default_price: defaultPriceId }),
    };

    const updatedProduct = await stripeManager.createOrUpdateProduct(
      dataToSend
    );
    return { success: true, data: updatedProduct.data };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

type deactivateOldPricesProps = {
  prices: iStripeProduct["prices"];
  newPriceId: string;
  interval?: "month" | "year" | "week" | "day";
  oldPrice?: number;
  defaultPrice?: string;
};

const deactivateOldPrices = async ({
  prices,
  newPriceId,
  interval,
  oldPrice,
  defaultPrice,
}: deactivateOldPricesProps): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  // We retrieve the prices of the product and deactivate the old ones
  let searchPrices;
  const dataToSendForInterval = {
    product: prices[0].product,
    active: true,
    newPriceId: newPriceId,
    type: "recurring",
    recurringInterval: interval ?? "",
    oldPrice: oldPrice ?? 0,
    defaultPrice: defaultPrice ?? "",
  };
  if (!interval) {
    searchPrices = await stripeManager.searchPrices(`
    product: "${prices[0].product}" AND active: "true"
  `);
  } else {
    searchPrices = await searchPricesRaw(dataToSendForInterval);
  }

  if (searchPrices.error) return { error: searchPrices.error };
  const deactivatingOldPrices = searchPrices.data.map((price: any) => {
    if (price.id === newPriceId) return;
    return stripeManager.createOrUpdatePrice("update", {
      id: price.id,
      currency: price.currency,
      metadata: { active: "false" },
      active: false,
    });
  });
  const deactivatedOldPrices = await Promise.all(deactivatingOldPrices);
  if (deactivatedOldPrices.some((price) => price?.error))
    throw new Error("Error deactivating old prices");
  return { success: true, data: deactivatedOldPrices };
};

interface createNewPriceForPlan {
  data: Partial<iPlan>;
  dataToSet: {} & Stripe.PriceCreateParams;
}
const createNewPriceForPlan = async ({
  data,
  dataToSet,
}: createNewPriceForPlan): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  if (!data.stripeId || !data.id) throw new Error("No stripeId found");
  try {
    const newPrice = await stripeManager.createOrUpdatePrice(
      "create",
      dataToSet
    );
    if (newPrice.error) throw new Error(newPrice.error);
    return { success: true, data: newPrice.data };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

function handleError(data: any) {
  if (data.serverError && Object.keys(data.serverError).length > 0) {
    console.log("Server error: ", data.serverError);
    return { error: true, message: data.serverError };
  } else if (
    data.validationErrors &&
    Object.keys(data.validationErrors).length > 0
  ) {
    const firstValidationErrorKey = Object.keys(data.validationErrors)[0];
    const firstValidationError = data.validationErrors[firstValidationErrorKey];
    console.error("Validation error: ", data.validationErrors);
    const errorMessage = Array.isArray(firstValidationError)
      ? firstValidationError[0]
      : firstValidationError;
    return { error: true, message: errorMessage };
  } else {
    return { error: false };
  }
}
