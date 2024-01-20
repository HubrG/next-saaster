import { prisma } from "@/src/lib/prisma";


export const isEmptyUser = async () => {
    const users = await prisma.user.count();
    // If there are no users, return 0
    if (users === 0) {
        return true;
    }
    return false;
}

export const getAppSettings = async () => {
    const settings = await prisma.appSettings.findFirst();
    if (!settings) {
        return null;
    }
    return settings;
}