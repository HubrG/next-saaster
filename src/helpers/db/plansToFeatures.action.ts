"use server";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { PlanToFeature } from "@prisma/client";

export const getPlansToFeatures = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const plansToFeatures = await prisma.planToFeature.findMany({
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
    if (!plansToFeatures) throw new Error("No plans to features found");
    return { success: true, data: plansToFeatures as PlanToFeature[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
