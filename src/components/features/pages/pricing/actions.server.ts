"use server";

import { prisma } from "@/src/lib/prisma";


export const changeCssTheme = async (theme: string) => {
    // On recherche l'ID de l'application
    const appSettings = await prisma.appSettings.findFirst();
    if (!appSettings) {
        throw new Error("App settings not found");
    }
    return prisma.appSettings.update({
        where: { id: appSettings.id },
        data: { theme: theme },
    });

}
