"use server";
import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { SaasSettings } from "@prisma/client";

export const getSaasSettings = async (): Promise<{
  success?: boolean;
  data?: SaasSettings;
  error?: string;
}> => {
  try {
    const saasSettings = await prisma.saasSettings.findUnique({
      where: {
        id: "first",
      },
    });
    if (!saasSettings) {
      const saasSettings = await prisma.saasSettings.create({
        data: {
          id: "first",
        },
      });
      return handleResponse(saasSettings);
    }
    if (!saasSettings) throw new Error("No saas settings found");
    return handleResponse<SaasSettings>(saasSettings);
  } catch (error) {
    return handleResponse(undefined, error);
  }
};
