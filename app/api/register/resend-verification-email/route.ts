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
      throw new Error(t("API.ResendVerificationEmail.error.user-not-found"));
    }

    if (user.emailVerified) {
      throw new Error(
        t("API.ResendVerificationEmail.error.email-already-verified")
      );
    }

    const token = await bcrypt.hash(email, 10);

    const addToken = await prisma.verificationToken.create({
      data: {
        identifier: user.email ?? "",
        token: token ?? "", 
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    if (!addToken) {
      throw new Error(t("API.ResendVerificationEmail.error.token-not-created"));
    }

    return NextResponse.json(
      {
        message: t("API.ResendVerificationEmail.success"),
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: t("API.ResendVerificationEmail.error.unknown-error") },
        { status: 500 }
      );
    }
  }
}
