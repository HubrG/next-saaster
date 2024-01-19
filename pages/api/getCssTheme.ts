import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
const getCssTheme = async (req: NextApiRequest, res: NextApiResponse) => {
    const theme = await prisma.appSettings.findFirst();
    if (!theme) {
        return "pink2";
    }
    res.status(200).json(theme.theme);
}

export default getCssTheme;