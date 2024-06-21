import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("HowItWorks.metadatas.title"),
  });
};
export default function HowItWorksPage() {
  return <div>TEst</div>;
}
