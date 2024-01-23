import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import createMetadata from "@/src/lib/metadatas";
import { getAppSettings } from "../server.actions";
import { appSettings } from "@prisma/client";
import { AdminComponent } from "@/src/components/features/pages/admin/Admin";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Admin",
  });
};

export default async function Admin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }
  const appSettings = await getAppSettings();
  if (!appSettings) {
    return null;
  }

  return (
    <div className="admin">
      <AdminComponent appSettings={appSettings as appSettings} />
    </div>
  );
}
