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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const addNewMRRSPlan = async () => {
  const session = await isSuperAdmin();
  if (!session) return false;
  // function de suppression du plan créé
  function deletePlan(planId: string) {
    prisma.mRRSPlan.delete({
      where: { id: planId },
    });
    return false;
  }
  const newPlan = await prisma.mRRSPlan.create({
    data: {},
  });
  const product = await stripe.products.create({
    name: newPlan.id,
    description: "New product created from the admin panel",
  });
  const saasSettings = await prisma.saasSettings.findFirst({});
  if (!product) return deletePlan(newPlan.id);
  const yearlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 1000,
    currency: saasSettings?.currency ?? "usd",
    recurring: { interval: "year" },
  });
  if (!yearlyPrice) return deletePlan(newPlan.id);
  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 100,
    currency: saasSettings?.currency ?? "usd",
    recurring: { interval: "month" },
  });
  if (!monthlyPrice) return deletePlan(newPlan.id);
  const freePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 0,
    recurring: { interval: "month" },
    currency: saasSettings?.currency ?? "usd",
  });
  if (!freePrice) return deletePlan(newPlan.id);
  //
  const updatePlanProductStripe = await prisma.mRRSPlan.update({
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
          planId: newPlan.id,
          featureId: feature.id,
        },
      })
    )
  );
  return { newPlan: updatePlanProductStripe, newFeatures: newFeatures };
};

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

export const updateMRRSPlan = async (planId: string, planData: any) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  // Exclure les données de relation de l'objet 'planData'
  const { MRRSFeatures, ...filteredPlanData } = planData;

  // On rerecherche le plan pour récupérer les données de relation
  const plan = await prisma.mRRSPlan.findUnique({
    where: { id: planId },
    include: {
      MRRSFeatures: true,
    },
  });
  if (!plan) return false;

  // Si le monthlyPrice est différent du précédent, mettre à jour le prix mensuel
  const saasSettings = await prisma.saasSettings.findFirst({});
  //

  let monthlyPriceId = plan.stripeMonthlyPriceId;
  let yearlyPriceId = plan.stripeYearlyPriceId;
  if (planData.monthlyPrice !== plan.monthlyPrice) {
    // On desactive le prix mensuel précédent de Stripe
    const deactivatedMonthlyPrice = await stripe.prices.update(
      plan.stripeMonthlyPriceId,
      {
        active: false,
      }
    );
    if (!deactivatedMonthlyPrice) return false;

    const createMonthlyPrice = await stripe.prices.create({
      product: plan.stripeId,
      unit_amount: planData.monthlyPrice
        ? Math.round(planData.monthlyPrice * 100).toString()
        : 0,
      currency: saasSettings?.currency ?? "usd",
      recurring: { interval: "month" },
    });
    if (!createMonthlyPrice) return false;
    monthlyPriceId = createMonthlyPrice.id;
  }
  // Si le yearlyPrice est différent du précédent, mettre à jour le prix mensuel
  if (planData.yearlyPrice !== plan.yearlyPrice) {
    // On desactive le prix annuel précédent de Stripe
    const deactivatedYearlyPrice = await stripe.prices.update(
      plan.stripeYearlyPriceId,
      {
        active: false,
      }
    );
    if (!deactivatedYearlyPrice) return false;
    // On créé un nouveau prix annuel
    const createYearlyPrice = await stripe.prices.create({
      product: plan.stripeId,
      unit_amount: planData.yearlyPrice
        ? Math.round(planData.yearlyPrice * 100).toString()
        : 0,
      currency: saasSettings?.currency ?? "usd",
      recurring: { interval: "year" },
    });
    if (!createYearlyPrice) return false;
    yearlyPriceId = createYearlyPrice.id;
  }
  // On met à jour le plan avec les nouveaux prix (id)
  const updatePlan = await prisma.mRRSPlan.update({
    where: { id: planId },
    data: {
      ...filteredPlanData,
      stripeMonthlyPriceId: monthlyPriceId,
      stripeYearlyPriceId: yearlyPriceId,
    },
  });
  const product = await stripe.products.update(updatePlan.stripeId, {
    name: updatePlan.name,
    description: updatePlan.description,
    active: updatePlan.active,
  });
  if (!product) return false;
  return updatePlan;
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
