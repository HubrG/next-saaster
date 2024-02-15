import { getSaasSettings } from "@/src/helpers/utils/saasSettings";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { getAppSettings } from "../../../src/helpers/utils/appSettings";

export async function POST() {
  const users = await prisma.user.count();
  if (users === 0) {
    const createFirstAppSettings = (await getAppSettings()).data;
    const createFirstSaasSettings = (await getSaasSettings()).data;
    if (!createFirstAppSettings || !createFirstSaasSettings) {
      return NextResponse.json(
        { error: "Error creating first settings" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ status: 200 });
}
