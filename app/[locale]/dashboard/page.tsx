import { Index } from "@/app/[locale]/dashboard/components/Index";
import { Index as LoginForm } from "@/app/[locale]/login/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { Loader } from "lucide-react";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Dashboard",
  });
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-r" />
        <div className="w-full  md:h-screen h-auto flex justify-center items-center">
          <Suspense fallback={<Loader />}>
            <LoginForm />
          </Suspense>
        </div>
      </>
    );
  }

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="dashboard user-interface">
        <Index />
      </div>
    </>
  );
}
