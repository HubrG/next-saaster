import { prisma } from "@/src/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { token, locale } = reqBody;
    const t = await getTranslations({ locale });
    const user = await prisma.verificationToken.findUnique({
      where: {
        token: token,
        expires: {
          gte: new Date().toISOString(),
        },
      },
    });
    if (!user) {
      throw new Error(t("API.VerifyEmail.expired-token"));
    }

    const userVerified = await prisma.user.update({
      where: {
        email: user.identifier,
      },
      data: {
        emailVerified: new Date().toISOString(),
      },
    });

    if (!userVerified) {
      throw new Error("User not found");
    }

    const deleteToken = await prisma.verificationToken.delete({
      where: {
        token: token,
      },
    });

    if (!deleteToken) {
      throw new Error("Error deleting token");
    }

    return NextResponse.json(
      { message: t("API.VerifyEmail.success"), success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
