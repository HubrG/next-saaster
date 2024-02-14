import { prisma } from "@/src/lib/prisma";
import bcrypt, { hash } from "bcrypt";
import { capitalize } from "lodash";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log(req.json());
  try {
    const hashedPassword = await hash(password, 10);
    //
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      throw new Error("A user has already registered this email address");
    }
    const createUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split("@")[0],
      },
    });
    if (!createUser) {
      throw new Error("An error occurred while creating the user");
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
        "An error occurred while creating the token verification"
      );
    }

    return NextResponse.json(
      {
        message: `Welcome ${capitalize(
          createUser.name ?? ""
        )} ! Thank you for your trust. You will receive a welcome email with a link to confirm its validity. \n\nYou can now log in with your username and password.`,
        token: token,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
