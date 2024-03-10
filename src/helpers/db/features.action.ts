"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import {
  ActionError,
  action,
  adminAction,
  authAction,
} from "@/src/lib/safe-actions";
import { iFeature } from "@/src/types/db/iFeatures";
import { updateFeatureSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";

export const getFeatures = action(
  z.object({
    secret: z.string(),
  }),
  async ({ secret }): Promise<HandleResponseProps<iFeature[]>> => {
    // 🔐 Security - If internal secret has been sent, we verify if it's the right one (for internal use only)
    if (secret !== process.env.NEXTAUTH_SECRET) {
      return handleRes<iFeature[]>({
        error: new ActionError("Unauthorized"),
        statusCode: 401,
      });
    }
    // 🔓 Unlocked
    try {
      const features = await prisma.feature.findMany({
        orderBy: {
          position: "asc",
        },
        include: include,
      });
      if (!features) throw new ActionError("No features found");
      return handleRes<iFeature[]>({
        success: features,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeature[]>({ error: ActionError, statusCode: 500 });
    }
  }
);

export const getFeature = authAction(
  z.object({
    id: z.string().cuid(),
  }),
  async ({ id }): Promise<HandleResponseProps<iFeature>> => {
    try {
      const feature = await prisma.feature.findUnique({
        where: { id },
        include,
      });
      if (!feature) throw new ActionError("No feature found");
      return handleRes<iFeature>({
        success: feature,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeature>({ error: ActionError, statusCode: 500 });
    }
  }
);

export const createFeature = adminAction(
  z.void(),
  async (): Promise<HandleResponseProps<iFeature>> => {
    try {
      const feature = await prisma.feature.create({
        data: {},
        include,
      });
      if (!feature) throw new ActionError("No feature created");
      return handleRes<iFeature>({
        success: feature,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeature>({ error: ActionError, statusCode: 500 });
    }
  }
);

export const updateFeature = adminAction(
  updateFeatureSchema,
  async ({ data }): Promise<HandleResponseProps<iFeature>> => {
    try {
      const feature = await prisma.feature.update({
        where: { id: data.id },
        data: {
          ...data,
          alias: data.alias === "" ? null : data.alias,
        },
        include,
      });
      if (!feature) throw new ActionError("No feature found");
      return handleRes<iFeature>({
        success: feature,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeature>({ error: ActionError, statusCode: 500 });
    }
  }
);

const include = {
  Plans: {
    include: {
      plan: true,
    },
  },
  category: true,
};
