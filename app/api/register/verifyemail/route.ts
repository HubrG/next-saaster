import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    const user = await prisma.verificationToken.findUnique({
      where: {
        token: token,
        expires: {
          gte: new Date().toISOString(),
        },
      },
    });
    if (!user) {
      throw new Error("Verification token expired or not found");
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
      { message: "Your email has been verified", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
