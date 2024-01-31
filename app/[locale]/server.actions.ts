import { prisma } from "@/src/lib/prisma";

export const isEmptyUser = async () => {
  const users = await prisma.user.count();
  // If there are no users, return 0
  if (users === 0) {
    return true;
  }
  return false;
};

export const getAppSettings = async () => {
  const settings = await prisma.appSettings.findUnique({
    where: {
      id: "first",
    },
  });
  if (!settings) {
    const createFirst = await prisma.appSettings.create({
      data: {
        id: "first",
      },
    });
    return createFirst;
  }
  return settings;
};

export const getSaasSettings = async () => {
  const settings = await prisma.saasSettings.findUnique({
    where: {
      id: "first",
    },
  });
  if (!settings) {
    const createFirst = await prisma.saasSettings.create({
      data: {
        id: "first",
      },
    });
    return createFirst;
  }
  return settings;
};

export const getSaasMRRSPlans = async () => {
  const plans = await prisma.mRRSPlan.findMany({
    orderBy: {
      position: "asc",
    },
    include: {
      MRRSFeatures: true,
    },
  });
  return plans;
};



export const getSaasMRRSFeatures = async () => {
  const features = await prisma.mRRSFeature.findMany({
    orderBy: {
      position: "asc",
    },
    include: {
      MRRSPlans: {
        include: {
          plan: true,
        },
      },
      category: true,
    },
  });
  return features;
};

export const getSaasMRRSFeaturesCategories = async () => {
  const featuresCat = await prisma.mRRSFeatureCategory.findMany({
    orderBy: {
      position: "asc",
    },
    include: {
      MRRSFeatures: {
        include: {
          MRRSPlans: {
            include: {
              plan: true,
            },
          },
        },
      },
    },
  });
  return featuresCat;
};

export const getSaasMRRSPlanToFeature = async () => {
  const planToFeatures = await prisma.mRRSPlanToFeature.findMany({
    include: {
      plan: true,
      feature: true,
    },
  });
  return planToFeatures;
};