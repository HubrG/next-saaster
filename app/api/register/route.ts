import { prisma } from "@/src/lib/prisma";
import bcrypt, { hash } from "bcrypt";
import { capitalize } from "lodash";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, locale } = await req.json();
  const t = await getTranslations({ locale });

  try {
    const hashedPassword = await hash(password, 10);
    //
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      throw new Error(t("API.Register.error.user-already-exists"));
    }
    const createUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split("@")[0],
      },
    });
    if (!createUser) {
      throw new Error(t("API.Register.error.user-not-created"));
    }
    const token = await bcrypt.hash(email, 10);

    const addToken = await prisma.verificationToken.create({
      data: {
        identifier: createUser.email ?? "",
        token: token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    if (!addToken) {
      throw new Error(
        t("API.Register.error.token-not-created")
      );
    }

    return NextResponse.json(
      {
        message: `${t("API.Register.success", {
          varIntlName: capitalize(createUser.name ?? ""),
        })}`,
        token: token,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: t("API.Register.error.unknown-error") },
        { status: 500 }
      );
    }
  }
}
