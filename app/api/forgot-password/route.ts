import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, locale } = await req.json();

  const t = await getTranslations({ locale });
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }
    //   We generate a token that will be used to verify the email address
    const randomToken = Math.random().toString(36).substring(2, 15);
    const token = await bcrypt.hash(randomToken, 10);

    const addToken = await prisma.verificationToken.create({
      data: {
        identifier: email ?? "",
        token: token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    if (!addToken) {
      console.error("An error occurred while creating the token verification");
      throw new Error(
        "An error occurred while creating the token verification"
      );
    }

    return NextResponse.json(
      {
        message: `${t("API.ForgotPassword.success", {
          varIntlEmail: email,
        })}`,
        token: token,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: `${t("API.ForgotPassword.success", {
          varIntlEmail: email,
        })}`,
      },
      { status: 200 }
    );
  }
}
