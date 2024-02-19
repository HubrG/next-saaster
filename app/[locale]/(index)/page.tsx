import { FirstConnexion } from "@/app/[locale]/(index)/components/FirstConnexion";
import { Index } from "@/app/[locale]/(index)/components/Index";
import { Link } from "@/src/lib/intl/navigation";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";
import { isEmptyUser } from "../../../src/helpers/utils/emptyUser";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Accueil",
  });
};
// Utiliser la fonction loadAndCreateMetadata pour obtenir les métadonnées

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    const emptyUser = await isEmptyUser();
    // If the database is empty, we create a first user who will be Admin with the github provider
    if (emptyUser) {
      return <FirstConnexion />;
    }
  }
  const t = await getTranslations("Index");
  return (
    <div className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="font-mono font-bold">{t("title")}</h1>
      <Link href="/">In english</Link>
      <Link href="/" locale="fr">
        En français
      </Link>
      <Link href="/admin">Admin</Link>
      <Index />
    </div>
  );
}
