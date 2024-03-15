"use server";
import { HandleResponseProps, handleRes } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { action } from "@/src/lib/safe-actions";
import { iPlanToFeature } from "@/src/types/db/iPlanToFeature";
import { PlanToFeature } from "@prisma/client";
import { z } from "zod";

/**
 * This function gets all plans linked to features
 * @returns {Promise<HandleResponseProps<PlanToFeature[]>>} The response
 * @name getPlansToFeatures
 */
export const getPlansToFeatures = action(
  z.object({}),
  async (): Promise<HandleResponseProps<iPlanToFeature[]>> => {
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
      return handleRes<iPlanToFeature[]>({
        success: plansToFeatures,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iPlanToFeature[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
