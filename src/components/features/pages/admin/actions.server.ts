"use server";
import { isAdmin } from "@/src/functions/isAdmin";
import { prisma } from "@/src/lib/prisma";
import { SaasSettings, appSettings } from "@prisma/client";

type DesignSettingsData = {
  roundedCorner: number;
  theme: string;
};

type SaasSettingsData = {
  tax: SaasSettings["tax"];
  saasType: SaasSettings["saasType"];
};

export const changeDesignSettings = async (
  settingsId: string,
  data: DesignSettingsData
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: data,
  });
  if (
    updateSetting.roundedCorner !== data.roundedCorner ||
    updateSetting.theme !== data.theme
  ) {
    return false;
  }
  return true;
};

export const changeSaasSettings = async (
  settingsId: string,
  data: SaasSettingsData
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.saasSettings.update({
    where: { id: settingsId },
    data: data,
  });
  if (
    updateSetting.tax !== data.tax ||
    updateSetting.saasType !== data.saasType
  ) {
    return false;
  }
  return true;
};

export const changeCssTheme = async (settingsId: string, theme: string) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { theme: theme },
  });
  if (updateSetting.theme !== theme) {
    return false;
  }
  return true;
};

export const changeRoundedCorner = async (
  settingsId: string,
  radius: number
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { roundedCorner: radius },
  });
  if (updateSetting.roundedCorner !== radius) {
    return false;
  }
  return true;
};

export const changeDefaultDarkMode = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { defaultDarkMode: toggle },
  });
  if (updateSetting.defaultDarkMode !== toggle) {
    return false;
  }
  return true;
};

export const changeActiveDarkMode = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { activeDarkMode: toggle },
  });
  if (updateSetting.activeDarkMode !== toggle) {
    return false;
  }
  return true;
};

export const changeActiveTopLoader = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { activeTopLoader: toggle },
  });
  if (updateSetting.activeTopLoader !== toggle) {
    return false;
  }
  return true;
};

export const changeActiveCtaOnNavbar = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { activeCtaOnNavbar: toggle },
  });
  if (updateSetting.activeCtaOnNavbar !== toggle) {
    return false;
  }
  return true;
};

type UpdateInfosApp = Pick<appSettings, "name" | "description" | "baseline">;

export const updateInfosApp = async (
  settingsId: string,
  data: UpdateInfosApp
) => {
  const session = await isAdmin();
  if (!session) return false;

  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: data,
  });

  const isUpdated =
    data.name === updateSetting.name &&
    data.description === updateSetting.description &&
    data.baseline === updateSetting.baseline;
  if (!isUpdated) return false;
  return isUpdated;
};

export const getFeatureCategories = async () => {
  const session = await isAdmin();
  if (!session) return false;
  const categories = await prisma.pricingFeatureCategory.findMany();
  return categories || null;
};

export const changeActiveYearlyPlans = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.saasSettings.update({
    where: { id: settingsId },
    data: { activeYearlyPlans: toggle },
  });
  if (updateSetting.activeYearlyPlans !== toggle) {
    return false;
  }
  return true;
};

export const changeActiveMonthlyPlans = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await isAdmin();
  if (!session) return false;
  const updateSetting = await prisma.saasSettings.update({
    where: { id: settingsId },
    data: { activeMonthlyPlans: toggle },
  });
  if (updateSetting.activeMonthlyPlans !== toggle) {
    return false;
  }
  return true;
};
