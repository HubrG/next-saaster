"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { getStripeCoupons } from "@/src/helpers/utils/stripeCoupons";
import { prisma } from "@/src/lib/prisma";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iPlan } from "@/src/types/iPlans";
import { iStripeCoupon } from "@/src/types/iStripeCoupons";
import { iStripePlanCoupon } from "@/src/types/iStripePlanCoupons";
import {
  Feature,
  FeatureCategory,
  Plan,
  SaasSettings,
  SaasTypes,
  appSettings,
} from "@prisma/client";
import { StripeManager } from "../classes/stripeManagerClass";
const stripeManager = new StripeManager();

// SECTION Create  Plan
export const addNewPlan = async (saasType: SaasTypes) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  let newPlan: Partial<Plan> | null = null;

  async function deletePlan(planId: string) {
    await prisma.plan.delete({
      where: { id: planId },
    });
  }

  try {
    newPlan = await prisma.plan.create({
      data: {
        saasType: saasType,
      },
    });
    if (!newPlan.id || !newPlan) throw new Error("Failed to create new plan");

    const init = await initializeProductAndPricesWithStripe(newPlan as Plan);
    const approvedPlan = init.plan;
    const lastProduct = init.lastProduct;

    const features = await prisma.feature.findMany();
    const newFeatures = await Promise.all(
      features.map((feature) =>
        prisma.planToFeature.create({
          data: {
            planId: newPlan?.id as iPlanToFeature["planId"],
            featureId: feature.id,
          },
        })
      )
    );

    return { newPlan, newFeatures, approvedPlan, lastProduct };
  } catch (error) {
    console.error(error);
    if (newPlan?.id) {
      await deletePlan(newPlan.id);
    }
    return false;
  }
};

export const initializeProductAndPricesWithStripe = async (plan: Plan) => {
  try {
    const saasSettings =
      (await prisma.saasSettings.findFirst({})) ||
      ({
        currency: "usd",
      } as SaasSettings);

    // On supprime tous les prodcuts liés au plan et les prices liés aux produits
    const resetAll = await prisma.stripeProduct.deleteMany({
      where: {
        PlanId: plan.id,
      },
    });
    if (!resetAll) throw new Error("Failed to reset all products");

    const product = await stripeManager.createProduct(
      plan.id,
      "New product created from the admin panel",
      { planId: plan.id },
      plan.active ?? false,
      plan.name ?? ""
    );
    if (!product) throw new Error("Failed to create Stripe product");

    const pricesToCreate: { amount: number; interval: "month" | "year" }[] = [
      { amount: 0, interval: "year" },
      { amount: 0, interval: "month" },
      { amount: 0, interval: "month" },
    ];

    const prices = await Promise.all(
      pricesToCreate.map((price) =>
        stripeManager.createNewPrices(
          product.id,
          price.amount,
          saasSettings.currency ?? "usd",
          price.interval
        )
      )
    );

    if (prices.some((price) => !price))
      throw new Error("Failed to create one or more Stripe prices");

    const [yearlyPrice, monthlyPrice, freePrice] = prices;
    if (!yearlyPrice || !monthlyPrice || !freePrice)
      throw new Error("Failed to create one or more Stripe prices");
    const approvedPlan = await prisma.plan.update({
      where: { id: plan.id },
      data: {
        stripeId: product.id,
        stripeYearlyPriceId: yearlyPrice,
        stripeMonthlyPriceId: monthlyPrice,
        stripeFreePriceId: freePrice,
      },
      include: {
        StripeProduct: true,
      },
    });

    const lastProduct = await prisma.stripeProduct.findUnique({
      where: { id: product.id },
      include: { PlanRelation: true, prices: true },
    });
    if (!lastProduct) throw new Error("Failed to find last product");
    return { plan: approvedPlan, return: true, lastProduct: lastProduct };
  } catch (error: any) {
    console.log(error.message);
    return { plan: plan, return: false };
  }
};
// SECTION Update  Plan

export const updatePlan = async (planId: string, planData: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const { Features, ...filteredPlanData } = planData;

  let plan = (await prisma.plan.findUnique({
    where: { id: planId },
    include: { Features: true },
  })) as iPlan;
  if (!plan) return false;

  const saasSettings = await prisma.saasSettings.findFirst({});
  const currency = saasSettings?.currency ?? "usd";

  let monthlyPriceId = plan.stripeMonthlyPriceId;
  let yearlyPriceId = plan.stripeYearlyPriceId;
  let freePriceId = plan.stripeFreePriceId;
  // VERIFIER LA SYNCHRONISATION DES DONNEES AVEC STRIPE (À AMÉLIORER)
  let recreate = false;
  //
  const isProductExist = await stripeManager.getProduct(plan.stripeId ?? "no");
  const isMonthlyPriceExist = await stripeManager.getPrice(
    plan.stripeMonthlyPriceId ?? "no"
  );
  const isYearlyPriceExist = await stripeManager.getPrice(
    plan.stripeYearlyPriceId ?? "no"
  );
  const isProductExistOnBDD = await prisma.stripeProduct.findUnique({
    where: { id: plan.stripeId ?? "" },
  });
  const isMonthlyPriceExistOnBDD = await prisma.stripePrice.findUnique({
    where: { id: plan.stripeMonthlyPriceId ?? "" },
  });
  const isYearlyPriceExistOnBDD = await prisma.stripePrice.findUnique({
    where: { id: plan.stripeYearlyPriceId ?? "" },
  });
  if (
    !isProductExist ||
    !isMonthlyPriceExist ||
    !isYearlyPriceExist ||
    !isProductExistOnBDD ||
    !isMonthlyPriceExistOnBDD ||
    !isYearlyPriceExistOnBDD
  ) {
    try {
      const create = await initializeProductAndPricesWithStripe(plan);
      if (create && !create.return) return false;
      if (create) plan = create.plan as iPlan;
      monthlyPriceId = plan.stripeMonthlyPriceId;
      yearlyPriceId = plan.stripeYearlyPriceId;
      freePriceId = plan.stripeFreePriceId;
      recreate = true;
    } catch (error) {
      console.error("Error creating new product and price:", error);
      return false;
    }
  }
  // FIN DE LA VERIFICATION
  if (plan.stripeId) {
    if (planData.monthlyPrice !== plan.monthlyPrice || recreate) {
      monthlyPriceId = await stripeManager.createOrUpdatePrice(
        plan.stripeId ?? "",
        monthlyPriceId ?? "",
        planData.monthlyPrice * 100,
        currency,
        "month"
      );
    }

    if (planData.yearlyPrice !== plan.yearlyPrice || recreate) {
      yearlyPriceId = await stripeManager.createOrUpdatePrice(
        plan.stripeId ?? "",
        yearlyPriceId ?? "",
        planData.yearlyPrice * 100,
        currency,
        "year"
      );
    }

    const updatePlanData = {
      ...filteredPlanData,
      stripeMonthlyPriceId: monthlyPriceId,
      stripeYearlyPriceId: yearlyPriceId,
      stripeFreePriceId: freePriceId,
      stripeId: plan.stripeId,
    };

    const { coupons, StripeProduct, ...updateDataWithoutCoupons } =
      updatePlanData;
    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        ...updateDataWithoutCoupons,
        active: planData.deleted ? false : updatePlanData.active,
      },
      include: {
        coupons: {
          include: {
            coupon: true,
          },
        },
      },
    });

    if (!updatedPlan || !updatedPlan.stripeId) return false;

    await stripeManager.updateProduct(
      updatedPlan.stripeId,
      planData.name,
      planData.description,
      updatedPlan.active ?? true,
      plan
    );
    return updatedPlan;
  }
};

// SECTION Add New  Feature

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

  const { Plans, categoryId, ...featureData } = data;

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
  });

  return updateCategory;
};

export const deleteFeatureCategory = async (categoryId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const deleteCategory = await prisma.featureCategory.delete({
    where: { id: categoryId },
  });

  return deleteCategory;
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

    return prisma.plan.findMany();
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des positions des plans :",
      error
    );
    return false;
  }
};

export const updateFeaturePosition = async (features: Feature[]) => {
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

    return prisma.feature.findMany();
  } catch (error) {
    console.error("Error updating feature positions in transaction:", error);
    return false;
  }
};

export const updateFeatureCategoryPosition = async (
  categories: FeatureCategory[]
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

  return newCategory;
};

export const createNewCoupon = async (data: Partial<iStripePlanCoupon>) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  let validatedDurationInMonths: number | undefined =
    typeof data.coupon?.durationInMonths === "number"
      ? data.coupon.durationInMonths
      : undefined;

  const validatedName: string | undefined = data.coupon?.name ?? undefined;
  const validatedPercentOff: number | undefined =
    typeof data.coupon?.percentOff === "number"
      ? data.coupon?.percentOff
      : undefined;

  const coupon = await stripeManager.createCoupon({
    duration: data.coupon?.duration as "forever" | "once" | "repeating",
    duration_in_months: validatedDurationInMonths,
    name: validatedName,
    max_redemptions: data.coupon?.maxRedemptions as number | undefined,
    percent_off: validatedPercentOff,
  });

  return coupon as iStripeCoupon;
};

export const deleteCoupon = async (couponId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const coupon = await stripeManager.deleteCoupon(couponId);
  if (coupon) {
    const allCoupons = (await getStripeCoupons()).data;
    return allCoupons as iStripeCoupon[];
  } else {
    return false;
  }
};

export const applyCoupon = async (
  couponId: string,
  planId: string,
  planRecurrence: "monthly" | "yearly" | "once"
) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  // Si un coupon existe déjà avec la même recurrence sur le même plan, on le supprime et on le remplace:
  const searchForReplace = await prisma.stripePlanCoupon.findMany({
    where: {
      PlanId: planId,
      recurrence: planRecurrence,
    },
  });
  // On supprime les coupons existants
  let deleteCoupon = false;
  if (searchForReplace.length > 0) {
    await prisma.stripePlanCoupon.deleteMany({
      where: {
        PlanId: planId,
        recurrence: planRecurrence,
      },
    });
    deleteCoupon = true;
  }
  // On crée le nouveau coupon
  if (
    (searchForReplace.length > 0 && deleteCoupon) ||
    searchForReplace.length === 0
  ) {
    const coupon = await prisma.stripePlanCoupon.create({
      data: {
        couponId: couponId,
        PlanId: planId,
        recurrence: planRecurrence,
      },
      include: {
        coupon: true,
        Plan: {
          include: {
            coupons: {
              include: {
                coupon: true,
              },
            },
          },
        },
      },
    });
    return coupon.Plan.coupons;
  }
};

export const revokeCoupon = async (couponId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const coupon = await prisma.stripePlanCoupon.delete({
    where: {
      id: couponId,
    },
    include: {
      coupon: true,
      Plan: {
        include: {
          coupons: {
            include: {
              coupon: true,
            },
          },
        },
      },
    },
  });

  return coupon.Plan.coupons;
};
