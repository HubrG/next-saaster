import { FirstConnexion } from "@/app/[locale]/(index)/components/FirstConnexion";
import HomePage from "@/app/[locale]/(index)/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";
import { isEmptyUser } from "../../../src/helpers/db/emptyUser.action";

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
  const session = await getServerSession(authOptions);

  if (!session) {
    const emptyUser = await isEmptyUser();
    // If the database is empty, we create a first user who will be Admin with the github provider
    if (emptyUser) {
      return <FirstConnexion />;
    }
  }

  const t = await getTranslations();
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <HomePage />
    </>
  );
}
