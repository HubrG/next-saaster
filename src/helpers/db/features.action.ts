"use server";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { Feature } from "@prisma/client";

export const getFeatures = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const features = await prisma.feature.findMany({
      orderBy: {
        position: "asc",
      },
      include: {
        Plans: {
          include: {
            plan: true,
          },
        },
        category: true,
      },
    });
    if (!features) throw new Error("No features found");
    return { success: true, data: features as Feature[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
