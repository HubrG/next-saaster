"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { MRRSPlanStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import { MRRSStripeCouponsWithPlans } from "@/src/types/MRRSStripeCouponsWithPlans";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  SaasTypes,
  appSettings,
} from "@prisma/client";
import { StripeManager } from "../classes/stripeManagerClass";
const stripeManager = new StripeManager();

// SECTION Create MRRS Plan
export const addNewMRRSPlan = async (saasType: SaasTypes) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  let newPlan: Partial<MRRSPlan> | null = null;

  async function deletePlan(planId: string) {
    await prisma.mRRSPlan.delete({
      where: { id: planId },
    });
  }

  try {
    newPlan = await prisma.mRRSPlan.create({
      data: {
        saasType: saasType,
      },
    });
    if (!newPlan.id || !newPlan) throw new Error("Failed to create new plan");

    const init = await initializeProductAndPricesWithStripe(
      newPlan as MRRSPlan
    );
    const approvedPlan = init.plan;
    const lastProduct = init.lastProduct;

    const features = await prisma.mRRSFeature.findMany();
    const newFeatures = await Promise.all(
      features.map((feature) =>
        prisma.mRRSPlanToFeature.create({
          data: {
            planId:
              newPlan?.id as MRRSPlanToFeatureWithPlanAndFeature["planId"],
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

export const initializeProductAndPricesWithStripe = async (plan: MRRSPlan) => {
  try {
    const saasSettings =
      (await prisma.saasSettings.findFirst({})) ||
      ({
        currency: "usd",
      } as SaasSettings);

    // On supprime tous les prodcuts liés au plan et les prices liés aux produits
    const resetAll = await prisma.stripeProduct.deleteMany({
      where: {
        MRRSPlanId: plan.id,
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
    const approvedPlan = await prisma.mRRSPlan.update({
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
      include: { MRRSPlanRelation: true, prices: true },
    });
    if (!lastProduct) throw new Error("Failed to find last product");
    return { plan: approvedPlan, return: true, lastProduct: lastProduct };
  } catch (error: any) {
    console.log(error.message);
    return { plan: plan, return: false };
  }
};
// SECTION Update MRRS Plan

export const updateMRRSPlan = async (planId: string, planData: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const { MRRSFeatures, ...filteredPlanData } = planData;

  let plan = (await prisma.mRRSPlan.findUnique({
    where: { id: planId },
    include: { MRRSFeatures: true },
  })) as MRRSPlanStore;
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
      if (create) plan = create.plan as MRRSPlanStore;
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
    const updatedPlan = await prisma.mRRSPlan.update({
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

// SECTION Add New MRRS Feature

export const addNewMMRSFeature = async () => {
  const session = await isSuperAdmin();
  if (!session) return false;
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
};

export const createNewCoupon = async (
  data: Partial<MRRSStripeCouponsWithPlans>
) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  // Traitement de `durationInMonths` pour exclure les valeurs `null`
  let validatedDurationInMonths: number | undefined =
    typeof data.durationInMonths === "number"
      ? data.durationInMonths
      : undefined;

  // S'assurer que `name` n'est pas `null` et que `percentOff` est un nombre
  const validatedName: string | undefined = data.name ?? undefined;
  const validatedPercentOff: number | undefined =
    typeof data.percentOff === "number" ? data.percentOff : undefined;

  const coupon = await stripeManager.createCoupon({
    duration: data.duration as "forever" | "once" | "repeating",
    duration_in_months: validatedDurationInMonths,
    name: validatedName,
    percent_off: validatedPercentOff,
  });

  return coupon as MRRSStripeCouponsWithPlans;
};

export const deleteCoupon = async (couponId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const coupon = await stripeManager.deleteCoupon(couponId);
  if (coupon) {
    const allCoupons = await prisma.stripeCoupon.findMany();
    return allCoupons;
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
      MRRSPlanId: planId,
      recurrence: planRecurrence,
    },
  });
  // On supprime les coupons existants
  let deleteCoupon = false;
  if (searchForReplace.length > 0) {
    await prisma.stripePlanCoupon.deleteMany({
      where: {
        MRRSPlanId: planId,
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
        MRRSPlanId: planId,
        recurrence: planRecurrence,
      },
      include: {
        coupon: true,
        MRRSPlan: {
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
    return coupon.MRRSPlan.coupons;
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
      MRRSPlan: {
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

  return coupon.MRRSPlan.coupons;
};
