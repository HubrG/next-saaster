import { Index } from "@/app/[locale]/dashboard/components/Index";
import { Index as LoginForm } from "@/app/[locale]/login/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { Loader } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { Suspense } from "react";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Dashboard.metadatas.title"),
  });
};

const DashboardIndex: React.ComponentType<any> = dynamic(
  () =>
    import("@/app/[locale]/dashboard/components/Index").then((mod) => mod.Index),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

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
