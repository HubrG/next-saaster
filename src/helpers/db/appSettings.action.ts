"use server";
import {
  HandleResponseProps,
  handleRes,
  handleResponse,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { adminAction } from "@/src/lib/safe-actions";
import { appSettings } from "@prisma/client";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";

export const getAppSettings = async (): Promise<{
  data?: appSettings | null;
  error?: string;
}> => {
  try {
    const appSettings = await prisma.appSettings.findUnique({
      where: {
        id: "first",
      },
    });
    if (!appSettings) {
      const appSettings = await prisma.appSettings.create({
        data: {
          id: "first",
        },
      });
      return handleResponse(appSettings);
    }
    return handleResponse(appSettings);
  } catch (error) {
    return handleResponse(undefined, error);
  }
};

export const updateAppSettings = adminAction(
  z.object({
    data: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      baseline: z.string().optional(),
      image: z.string().optional(),
    }),
    secret: z.string(),
  }),
  async ({ data, secret }): Promise<HandleResponseProps<appSettings>> => {
    // 🔐 Security - Only the owner of the organization can invite a user
    if (secret && !verifySecretRequest(secret)) {
      return handleRes<appSettings>({
        error: "Unauthorized",
        statusCode: 401,
      });
    }
    // 🔓 Unlocked
    try {
      const updatedAppSettings = await prisma.appSettings.update({
        where: {
          id: "first",
        },
        data,
      });
      return handleRes<appSettings>({
        success: updatedAppSettings,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<appSettings>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
