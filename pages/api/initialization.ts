import { getAppSettings, getSaasSettings } from "@/app/[locale]/queries";
import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const createFirst = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }
  const users = await prisma.user.count();
  // If there are no users, return 0
  if (users === 0) {
    const createFirstAppSettings = await getAppSettings();
    const createFirstSaasSettings = await getSaasSettings();
    if (!createFirstAppSettings || !createFirstSaasSettings) {
      return res.status(500).json({
        error: "Error creating first settings",
      });
    }
  }
  return res.status(200).json({});
};

export default createFirst;
