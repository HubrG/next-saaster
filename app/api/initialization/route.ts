import { isEmptyUser } from "@/src/helpers/db/emptyUser.action";
import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import { NextResponse } from "next/server";
import { getAppSettings } from "../../../src/helpers/db/appSettings.action";

export async function POST() {
  const users = await isEmptyUser();
  if (users) {
    const createFirstAppSettings = (await getAppSettings()).data;
    const createFirstSaasSettings = (await getSaasSettings()).data;
    console.error("Error creating first settings");
    if (!createFirstAppSettings || !createFirstSaasSettings) {
      return NextResponse.json(
        { error: "Error creating first settings" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ status: 200 });
}
