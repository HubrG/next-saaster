"use server";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { getStripeCoupons } from "@/src/helpers/utils/stripeCoupons";
import { prisma } from "@/src/lib/prisma";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iStripeCoupon } from "@/src/types/iStripeCoupons";
import { iStripePlanCoupon } from "@/src/types/iStripePlanCoupons";
import {
  Feature,
  FeatureCategory,
  Plan,
  SaasSettings,
  appSettings,
} from "@prisma/client";
import { StripeManager } from "../classes/stripeManagerClass";
const stripeManager = new StripeManager();

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
