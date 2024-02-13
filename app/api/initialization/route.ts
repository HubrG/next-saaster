import { getAppSettings, getSaasSettings } from "@/app/[locale]/queries";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";


export async function POST() {
  const users = await prisma.user.count();
  if (users === 0) {
    const createFirstAppSettings = await getAppSettings();
    const createFirstSaasSettings = await getSaasSettings();
    if (!createFirstAppSettings || !createFirstSaasSettings) {
      return NextResponse.json(
        { error: "Error creating first settings" },
        { status: 500 }
      );
    }
  }
    return NextResponse.json({ status: 200 });
}
