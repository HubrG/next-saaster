import { Index } from "@/app/[locale]/admin/components/Index";
import { Index as LoginForm } from "@/app/[locale]/login/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
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
      <>
        <DivFullScreenGradient gradient="gradient-to-r" />
        <div className="w-full  md:h-screen h-auto flex justify-center items-center">
          <Suspense fallback={<Loader />}>
            <LoginForm withGithub />
          </Suspense>
        </div>
      </>
    );
  }

  if (session.user.role === ("USER" as UserRole)) {
    redirect("/");
  }

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="admin user-interface">
        <Suspense fallback={<Loader />}>
            <Index />
        </Suspense>
      </div>
    </>
  );
}
