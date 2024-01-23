"use server";
import { appSettings } from '@prisma/client';
import { isAdmin } from '@/src/functions/isAdmin';
import { prisma } from '@/src/lib/prisma';

export const changeCssTheme = async (settingsId: string, theme: string) => {
  const session =  await isAdmin();
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

export const changeRoundedCorner = async (settingsId: string, radius: number) => {
  const session =  await isAdmin();
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

