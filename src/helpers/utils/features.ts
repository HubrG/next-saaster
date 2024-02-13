"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { MRRSFeature } from "@prisma/client";

export const getFeatures = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const features = await prisma.mRRSFeature.findMany({
      orderBy: {
        position: "asc",
      },
      include: {
        MRRSPlans: {
          include: {
            plan: true,
          },
        },
        category: true,
      },
    });
    if (!features) throw new Error("No app settings found");
    return { success: true, data: features as MRRSFeature[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
