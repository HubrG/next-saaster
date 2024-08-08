import { Index } from "@/app/[locale]/login/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Login.metadatas.title"),
  });
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error: boolean };
}) {
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className=" items-center justify-center ">
        <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
          <Suspense fallback={<SkeletonLoader type="page" />}>
            <Index error={searchParams.error} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
