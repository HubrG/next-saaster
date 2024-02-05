"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { MRRSPlanToFeatureWithPlanAndFeature } from "@/src/types/MRRSPlanToFeatureWithPlanAndFeature";
import {
  MRRSFeature,
  MRRSFeatureCategory,
  MRRSPlan,
  SaasSettings,
  appSettings,
} from "@prisma/client";
import { StripeManager } from "./classes/stripeManagerClass";
const stripeManager = new StripeManager();

// SECTION Create MRRS Plan
export const addNewMRRSPlan = async () => {
  const session = await isSuperAdmin();
  if (!session) return false;

  let newPlan: Partial<MRRSPlan> | null = null;

  // Helper function to rollback in case of errors
  async function deletePlan(planId: string) {
    await prisma.mRRSPlan.delete({
      where: { id: planId },
    });
  }

  try {
    newPlan = await prisma.mRRSPlan.create({ data: {} });
    if (!newPlan.id || !newPlan) throw new Error("Failed to create new plan");
    const saasSettings =
      (await prisma.saasSettings.findFirst({})) ||
      ({
        currency: "usd",
      } as SaasSettings);

    const product = await stripeManager.createProduct(
      newPlan.id,
      "New product created from the admin panel",
      { planId: newPlan.id }
    );
    if (!product) throw new Error("Failed to create Stripe product");

    const pricesToCreate: { amount: number; interval: "month" | "year" }[] = [
      { amount: 0, interval: "year" },
      { amount: 0, interval: "month" },
      { amount: 0, interval: "month" },
    ];
    
    const prices = await Promise.all(
      pricesToCreate.map((price) =>
        stripeManager.createPrice(
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
    await prisma.mRRSPlan.update({
      where: { id: newPlan.id },
      data: {
        stripeId: product.id,
        stripeYearlyPriceId: yearlyPrice.id,
        stripeMonthlyPriceId: monthlyPrice.id,
        stripeFreePriceId: freePrice.id,
      },
    });

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

    return { newPlan, newFeatures };
  } catch (error) {
    console.error(error);
    if (newPlan?.id) {
      await deletePlan(newPlan.id);
    }
    return false;
  }
};

// SECTION Update MRRS Plan

export const updateMRRSPlan = async (planId: string, planData: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  const { MRRSFeatures, ...filteredPlanData } = planData;

  const plan = await prisma.mRRSPlan.findUnique({
    where: { id: planId },
    include: { MRRSFeatures: true },
  });
  if (!plan) return false;

  const saasSettings = await prisma.saasSettings.findFirst({});
  const currency = saasSettings?.currency ?? "usd";

  let monthlyPriceId = plan.stripeMonthlyPriceId;
  let yearlyPriceId = plan.stripeYearlyPriceId;

  if (plan.stripeId) {
    if (planData.monthlyPrice !== plan.monthlyPrice && monthlyPriceId) {
      monthlyPriceId = await stripeManager.createOrUpdatePrice(
        plan.stripeId,
        monthlyPriceId,
        planData.monthlyPrice * 100,
        currency,
        "month"
      );
      if (!monthlyPriceId) return false;
    }

    if (planData.yearlyPrice !== plan.yearlyPrice && yearlyPriceId) {
      yearlyPriceId = await stripeManager.createOrUpdatePrice(
        plan.stripeId,
        yearlyPriceId,
        planData.yearlyPrice * 100,
        currency,
        "year"
      );
      if (!yearlyPriceId) return false;
    }

    const updatePlanData = {
      ...filteredPlanData,
      stripeMonthlyPriceId: monthlyPriceId,
      stripeYearlyPriceId: yearlyPriceId,
      stripeId: plan.stripeId,
    };

    const updatedPlan = await prisma.mRRSPlan.update({
      where: { id: planId },
      data: {
        ...updatePlanData,
        active: planData.deleted ? false : updatePlanData.active
      },
    });

    if (!updatedPlan || !updatedPlan.stripeId) return false;

    await stripeManager.updateProduct(
      updatedPlan.stripeId,
      planData.name,
      planData.description,
      updatedPlan.active??true
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
