"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { SaasSettings } from "@prisma/client";

export const getSaasSettings = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const saasSettings = await prisma.saasSettings.findFirst();
    if (!saasSettings) throw new Error("No saas settings found");
    return { success: true, data: saasSettings as SaasSettings };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
