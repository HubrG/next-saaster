"use server";
import { authOptions } from "@/src/lib/next-auth/auth";
import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth/next";
import { appSettings } from "@prisma/client";

export const changeCssTheme = async (settingsId: string, theme: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== "ADMIN") return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { theme: theme },
  });
  if (updateSetting.theme !== theme) {
    return false;
  }
  return true;
};

export const changeDefaultDarkMode = async (
  settingsId: string,
  toggle: boolean
) => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== "ADMIN") return false;
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
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== "ADMIN") return false;
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
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== "ADMIN") return false;
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
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role !== "ADMIN") return false;
  const updateSetting = await prisma.appSettings.update({
    where: { id: settingsId },
    data: { activeCtaOnNavbar: toggle },
  });
  if (updateSetting.activeCtaOnNavbar !== toggle) {
    return false;
  }
  return true;
};

