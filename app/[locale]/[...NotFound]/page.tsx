import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";
import NotFoundPage from "../not-found";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "404",
  });
};
export default function Error404() {
  return <NotFoundPage />;
}
