import HomePage from "@/app/[locale]/(index)/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Index.metadatas.title"),
    description: t("Index.metadatas.description"),
  });
};

export default async function Home() {

 

  const t = await getTranslations();
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex min-h-screen flex-col items-center  p-24" id="home">
        <h1 className="font-mono font-bold">{t("Index.title")}</h1>
        <HomePage />
      </div>
    </>
  );
}
