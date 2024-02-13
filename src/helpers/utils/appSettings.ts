"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { appSettings } from "@prisma/client";

export const getAppSettings = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const appSettings = await prisma.appSettings.findFirst();
    if (!appSettings) throw new Error("No app settings found");
    return { success: true, data: appSettings as appSettings };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
