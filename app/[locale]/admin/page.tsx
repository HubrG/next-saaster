import { Index as LoginForm } from "@/app/[locale]/login/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { Loader } from "@/src/components/ui/@blitzinit/loader";
import { redirect } from "@/src/lib/intl/navigation";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
const AdminIndex: React.ComponentType<any> = dynamic(
  () =>
    import("@/app/[locale]/admin/components/Index").then((mod) => mod.Index),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Admin",
  });
};

async function Admin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-tr" />
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
      <DivFullScreenGradient gradient="gradient-to-bl" />
      <div className="admin user-interface">
        <Suspense fallback={<Loader />}>
          <AdminIndex />
        </Suspense>
      </div>
    </>
  );
}

export default memo(Admin)
