import { AdminComponent } from "@/src/components/pages/admin/Admin";
import { LoginForm } from "@/src/components/pages/login/LoginForm";
import { Loader } from "@/src/components/ui/loader";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Admin",
  });
};

export default async function Admin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="w-full  md:h-screen h-auto flex justify-center items-center">
        <Suspense>
          <LoginForm withGithub />
        </Suspense>
      </div>
    );
  }
  if (session.user.role === ("USER" as UserRole)) {
    redirect("/");
  }

  return (
    <div className="admin user-interface !min-w-full ">
      <Suspense fallback={<Loader />}>
        <AdminComponent />
      </Suspense>
    </div>
  );
}
