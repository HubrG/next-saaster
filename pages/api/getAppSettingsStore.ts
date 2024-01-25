import { prisma } from "@/src/lib/prisma";
import { appSettings } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const getAppSettingsStore = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("ok");
  const getSettings = await prisma.appSettings.findFirst();

  if (!getSettings) {
    return res.status(500).json({
      error: "Error getting settings",
    });
  }
  return res.status(200).json(getSettings as appSettings);
};

export default getAppSettingsStore;
