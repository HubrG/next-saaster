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
    const appSettings = await prisma.appSettings.findUnique({
      where: {
        id: "first",
      },
    });
    if (!appSettings) {
      const appSettings = await prisma.appSettings.create({
        data: {
          id: "first",
        },
      });
      return { success: true, data: appSettings as appSettings };
    }
    return { success: true, data: appSettings as appSettings };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
