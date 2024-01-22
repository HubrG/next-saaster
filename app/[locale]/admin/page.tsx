import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import createMetadata from "@/src/lib/metadatas";
import { AdminNavbar } from "@/src/components/features/pages/admin/AdminNavbar";
import { AdminWrapper } from "@/src/components/features/pages/admin/ui/AdminWrapper";
import { AdminMain } from "@/src/components/features/pages/admin/AdminMain";

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

  return (
    <div className="admin">
      <AdminWrapper>
        <AdminNavbar />
        <AdminMain />
      </AdminWrapper>
    </div>
  );
}
