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
  });
  return plans;
};


export const getSaasMRRSFeatures = async () => {
  const features = await prisma.mRRSFeature.findMany({
    orderBy: {
      position: "asc",
    },
  });
  return features;
};
