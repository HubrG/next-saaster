import { isMe } from "@/src/helpers/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { iNotification } from "@/src/types/db/iNotifications";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const me = await isMe(searchParams.get("email") ?? "");
  if (!me) {
    return NextResponse.json(
      { error: "You are not authorized to perform this action" },
      { status: 401 }
    );
  }
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: String(userId) },
    orderBy: { createdAt: "desc" },
    include: { user: true, type: true },
  }) as iNotification[];

  return NextResponse.json(notifications as iNotification[], { status: 200 });
}
