"use server";
import { prisma } from "@/src/lib/prisma";
import { Resend } from "resend";
import { getErrorMessage } from "../../lib/getErrorMessage";
const resend = new Resend(process.env.RESEND_API_KEY);
interface AudienceData {
  id: string;
}
type CreateAudienceProps = {
  name: string;
};
/**
 * This function creates an audience in the Resend API and saves the audience in the database.
 * @param name
 * @returns { success: datas, data: datas } | { error: string }
 */
export const createAudience = async ({
  name = "",
}: CreateAudienceProps): Promise<{
  success?: boolean;
  data?: AudienceData;
  error?: string;
}> => {
  try {
    const isAudienceExist = await prisma.resendAudience.findUnique({
      where: {
        name: name,
      },
    });

    if (isAudienceExist) {
      throw new Error("This audience already exist");
    }

    const audience = await resend.audiences.create({
      name: name,
    });

    if (audience.error) {
      throw new Error(audience.error.message);
    } else {
      if (audience.data?.id) {
        const createAudience = await prisma.resendAudience.create({
          data: {
            id: audience.data.id,
            name: name,
          },
        });
        if (!createAudience) throw new Error("Audience creation failed");
      } else {
        throw new Error("Audience creation failed");
      }
    }
    return {
      success: true,
      data: audience.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 *
 * @returns { success: datas } | { error: string }
 */
export const getAudiences = async (): Promise<{
  success?: boolean;
  data?: {};
  error?: string;
}> => {
  try {
    const audiences = await resend.audiences.list();
    if (audiences.error) throw new Error(audiences.error.message);
    if (!audiences.data) throw new Error("No audiences found");

    return {
      success: true,
      data: audiences.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getAudience = async (id: string) => {
  try {
    const audience = await resend.audiences.get(id);
    if (audience.error) {
      throw new Error(audience.error.message);
    }
    return {
      success: true,
      data: audience.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 *
 * @param name
 * @returns { success: datas } | { error: string }
 */
export const getAudienceByName = async (name: string) => {
  try {
    const audience = await prisma.resendAudience.findUnique({
      where: {
        name: name,
      },
    });
    if (!audience) {
      throw new Error("Audience does not exist");
    }
    return {
      success: true,
      data: audience,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const deleteAudience = async (id: string) => {
  try {
    const audience = await resend.audiences.remove(id);
    if (audience.error) {
      throw new Error(audience.error.message);
    }
    return {
      success: true,
      data: audience.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
