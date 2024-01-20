import { prisma } from "@/src/lib/prisma";


export const getNumberOfUsers = async () => {
    const users = await prisma.user.count();
    return users;
}

export const getAppSettings = async () => {
    const settings = await prisma.appSettings.findFirst();
    if (!settings) {
        return null;
    }
    return settings;
}