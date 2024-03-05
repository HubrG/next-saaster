"use server";
import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { appSettings } from "@prisma/client";

export const getAppSettings = async (): Promise<{
  data?: appSettings | null;
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
      return handleResponse(appSettings);
    }
    return handleResponse(appSettings);
  } catch (error) {
    return handleResponse(undefined, error);
  }
};
