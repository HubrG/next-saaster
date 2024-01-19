import { prisma } from "@/src/lib/prisma";

export const getTheme = async () => {
  const theme = await prisma.appSettings.findFirst();
  if (!theme) {
    return "pink2";
  }
  return theme.theme;
};
