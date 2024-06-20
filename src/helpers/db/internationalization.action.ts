"use server";

import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, adminAction } from "@/src/lib/safe-actions";
import {
  InternationalizationDictionary,
  InternationalizationEnabledList,
} from "@prisma/client";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";

/**
 *  Get internationalizations from the database
 *
 * @returns The internationalizations
 */
export const getInternationalizations = action(
  z.object({
    secret: z.string().optional(),
  }),
  async ({
    secret,
  }): Promise<HandleResponseProps<InternationalizationEnabledList[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const inter = await prisma.internationalizationEnabledList.findMany();
      if (!inter) throw new ActionError("No internationalization founds");
      return handleRes<InternationalizationEnabledList[]>({
        success: inter as unknown as InternationalizationEnabledList[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationEnabledList[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const addLanguage = adminAction(
  z.object({
    secret: z.string().optional(),
    code: z.string(),
  }),
  async ({ secret, code }) => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const existingLang =
        await prisma.internationalizationEnabledList.findFirst({
          where: { code },
        });
      if (existingLang) throw new ActionError("Language already exists");

      const inter = await prisma.internationalizationEnabledList.create({
        data: {
          code,
        },
      });
      if (!inter) throw new ActionError("No internationalization founds");
      return handleRes<InternationalizationEnabledList>({
        success: inter as unknown as InternationalizationEnabledList,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationEnabledList>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const removeLanguage = adminAction(
  z.object({
    secret: z.string().optional(),
    code: z.string(),
  }),
  async ({ secret, code }) => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const inter = await prisma.internationalizationEnabledList.findMany({
        where: { code },
      });
      if (inter.length === 0)
        throw new ActionError("No internationalization found");

      const deletedInter =
        await prisma.internationalizationEnabledList.deleteMany({
          where: { code },
        });

      return handleRes<InternationalizationEnabledList[]>({
        success: inter as unknown as InternationalizationEnabledList[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationEnabledList[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getInternationalizationDictionary = action(
  z.object({
    secret: z.string().optional(),
    word: z.string(),
  }),
  async ({ secret, word }) => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const inter = await prisma.internationalizationDictionary.findMany({
        where: { word },
      });
      if (!inter) throw new ActionError("No word found");
      return handleRes<InternationalizationEnabledList[]>({
        success: inter as unknown as InternationalizationEnabledList[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationEnabledList[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getInternationalizationDictionaries = action(
  z.object({
    secret: z.string().optional(),
  }),
  async ({ secret }) => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const inter = await prisma.internationalizationDictionary.findMany();
      if (!inter) throw new ActionError("No word found");
      return handleRes<InternationalizationDictionary[]>({
        success: inter as unknown as InternationalizationDictionary[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationDictionary[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const addInternationalizationDictionary = adminAction(
  z.object({
    secret: z.string().optional(),
    word: z.string(),
  }),
  async ({ secret, word }) => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const existingLang =
        await prisma.internationalizationDictionary.findFirst({
          where: { word },
        });
      if (existingLang) throw new ActionError("Word already exists");

      const inter = await prisma.internationalizationDictionary.create({
        data: {
          word,
        },
      });
      if (!inter) throw new ActionError("No word found");
      return handleRes<InternationalizationDictionary>({
        success: inter as unknown as InternationalizationDictionary,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationDictionary>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const removeInternationalizationDictionary = adminAction(
  z.object({
    secret: z.string().optional(),
    word: z.string(),
  }),
  async ({ secret, word }) => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const inter = await prisma.internationalizationDictionary.findMany({
        where: { word },
      });
      if (inter.length === 0) throw new ActionError("No word found");

      const deletedInter =
        await prisma.internationalizationDictionary.deleteMany({
          where: { word },
        });

      return handleRes<InternationalizationDictionary[]>({
        success: inter as unknown as InternationalizationDictionary[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationDictionary[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateInternationalizationDictionary = adminAction(
  z.object({
    secret: z.string().optional(),
    id: z.string(),
    word: z.string(),
  }),
  async ({ secret, id, word }) => {
    console.log({ secret, id, word });
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const existingDict =
        await prisma.internationalizationDictionary.findUnique({
          where: { id },
        });
      if (!existingDict) throw new ActionError("Dictionary word not found");

      const updatedDict = await prisma.internationalizationDictionary.update({
        where: { id },
        data: { word },
      });
      return handleRes<InternationalizationDictionary>({
        success: updatedDict,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<InternationalizationDictionary>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export async function getEnabledLocales(): Promise<string[]> {
  const enabledLocales =
    await prisma.internationalizationEnabledList.findMany();
  return enabledLocales.map((locale) => locale.code);
}
