import { FirstConnexion } from "@/app/[locale]/(index)/components/FirstConnexion";
import { Index } from "@/app/[locale]/(index)/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { Link } from "@/src/lib/intl/navigation";
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
// Utiliser la fonction loadAndCreateMetadata pour obtenir les métadonnées

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
      <div className="flex min-h-screen flex-col items-center  p-24">
        <h1 className="font-mono font-bold">{t("Index.title")}</h1>
        <Link href="/" locale="en">
          In english
        </Link>
        <Link href="/" locale="fr">
          En français
        </Link>
        <Link href="/" locale="es">
          En español
        </Link>
        <Link href="/" locale="hi">
          हिंदी में
        </Link>
        <Link href="/" locale="zh">
          在中文
        </Link>
        <Link href="/" locale="tr">
          Türkçe
        </Link>
        <Link href="/" locale="ja">
          日本語で
        </Link>
        <Link href="/" locale="pt">
          Em português
        </Link>
        <Link href="/" locale="ar">
          بالعربية
        </Link>
        <Link href="/admin">Admin</Link>
        <Index />
      </div>
    </>
  );
}
