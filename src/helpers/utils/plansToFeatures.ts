"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { MRRSPlanToFeature } from "@prisma/client";

export const getPlansToFeatures = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const plansToFeatures = await prisma.mRRSPlanToFeature.findMany({
      include: {
        plan: true,
        feature: true,
      },
      orderBy: {
        plan: {
          position: "asc", // Utilisez 'asc' pour un ordre croissant ou 'desc' pour décroissant
        },
      },
    });
    if (!plansToFeatures) throw new Error("No app settings found");
    return { success: true, data: plansToFeatures as MRRSPlanToFeature[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
