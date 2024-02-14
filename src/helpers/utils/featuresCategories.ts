"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { FeatureCategory } from "@prisma/client";

export const getFeaturesCategories = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const featuresCategories = await prisma.featureCategory.findMany({});
    if (!featuresCategories) throw new Error("No app settings found");
    return { success: true, data: featuresCategories as FeatureCategory[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};