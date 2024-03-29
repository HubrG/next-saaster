"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, adminAction } from "@/src/lib/safe-actions";
import { iFeaturesCategories } from "@/src/types/db/iFeaturesCategories";
import {
  createFeaturesCategorySchema,
  updateFeaturesCategorySchema,
} from "@/src/types/schemas/dbSchema";
import { z } from "zod";

/**
 *  Get all features categories
 * @returns  Array of features categories
 */
export const getFeaturesCategories = async (): Promise<
  HandleResponseProps<iFeaturesCategories[]>
> => {
  try {
    const featuresCategories = await prisma.featureCategory.findMany({
      orderBy: {
        position: "asc",
      },
      include,
    });
   if (!featuresCategories) throw new ActionError("No feature found");
   return handleRes<iFeaturesCategories[]>({
     success: featuresCategories,
     statusCode: 200,
   });
  } catch (error) {
    return handleRes<iFeaturesCategories[]>({
      error: ActionError,
      statusCode: 500,
    });
  }
};

/**
 *  Get a feature category by id
 * @param id
 * @returns  A feature category
 */
export const updateFeaturesCategory = adminAction(
  updateFeaturesCategorySchema,
  async ({ data }): Promise<HandleResponseProps<iFeaturesCategories>> => {
    try {
      const featureCategory = await prisma.featureCategory.update({
        where: { id: data.id },
        data: {
          ...data,
        },
        include,
      });
      if (!featureCategory) throw new ActionError("No feature category found");
      return handleRes<iFeaturesCategories>({
        success: featureCategory,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeaturesCategories>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 *  Create a feature category
 * @param data
 * @returns  A feature category
 */
export const createFeaturesCategory = adminAction(
  createFeaturesCategorySchema,
  async ({ data }): Promise<HandleResponseProps<iFeaturesCategories>> => {
    try {
      const featureCategory = await prisma.featureCategory.create({
        data: {
          ...data,
        },
        include,
      });
      if (!featureCategory)
        throw new ActionError("Error creating feature category");
      return handleRes<iFeaturesCategories>({
        success: featureCategory,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeaturesCategories>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Delete a feature category
 * @param id
 * @returns 
 * @throws
 * ActionError
 * 
 */
export const deleteFeaturesCategory = adminAction(
  z.object({
    id: z.string().cuid(),
  }),
  async ({ id }): Promise<HandleResponseProps<iFeaturesCategories>> => {
    try {
      const featureCategory = await prisma.featureCategory.delete({
        where: { id },
        include,
      });
      if (!featureCategory)
        throw new ActionError("Error deleting feature category");
      return handleRes<iFeaturesCategories>({
        success: featureCategory,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeaturesCategories>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include =  {
  Features: true
};
