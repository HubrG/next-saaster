import { FirstConnexion } from "@/app/[locale]/(index)/components/FirstConnexion";
import { Index } from "@/app/[locale]/(index)/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { Link } from "@/src/lib/intl/navigation";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { Loader } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
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
        <Suspense fallback={<Loader />}>
          <Link href="/" locale="en">
            🇬🇧 In english
          </Link>
          <Link href="/" locale="fr">
            🇫🇷 En français
          </Link>
          <Link href="/" locale="es">
            🇪🇸 En español
          </Link>
          <Link href="/" locale="hi">
            🇮🇳 हिंदी में
          </Link>
          <Link href="/" locale="zh">
            🇨🇳 在中文
          </Link>
          <Link href="/" locale="tr">
            🇹🇷 Türkçe
          </Link>
          <Link href="/" locale="ja">
            🇯🇵 日本語で
          </Link>
          <Link href="/" locale="pt">
            🇵🇹 Em português
          </Link>
          <Link href="/" locale="ar">
            🇸🇦 بالعربية
          </Link>
          <Link href="/" locale="ru">
            🇷🇺 На русском
          </Link>
          <Link href="/" locale="it">
            🇮🇹 In italiano
          </Link>
          <Link href="/" locale="de">
            🇩🇪 Auf Deutsch
          </Link>
          <Link href="/" locale="bn">
            🇧🇩 বাংলা (bn - bangali)
          </Link>
          <Link href="/" locale="ko">
            🇰🇷 한국어로 (ko)
          </Link>
          <Link href="/" locale="el">
            🇬🇷 Στα ελληνικά
          </Link>
          <Link href="/" locale="fi">
            🇫🇮 Suomeksi
          </Link>
          <Link href="/" locale="hu">
            🇭🇺 Magyarul
          </Link>
          <Link href="/" locale="id">
            🇮🇩 Dalam bahasa Indonesia
          </Link>
          <Link href="/" locale="is">
            🇮🇸 Á íslensku s
          </Link>
          <Link href="/" locale="nl">
            🇳🇱 In het Nederlands
          </Link>
          <Link href="/" locale="no">
            🇳🇴 På norsk
          </Link>
          <Link href="/" locale="pl">
            🇵🇱 Po polsku
          </Link>
          <Link href="/" locale="sv">
            🇸🇪 På svenska
          </Link>
          <Link href="/" locale="th">
            🇹🇭 ในภาษาไทย
          </Link>
          <Link href="/" locale="vi">
            🇻🇳 Bằng tiếng Việt
          </Link>
        </Suspense>
        <Link href="/admin">Admin</Link>
        <Suspense>
          <Index />
        </Suspense>
      </div>
    </>
  );
}
