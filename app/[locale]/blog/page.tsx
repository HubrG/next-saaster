import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";
import ServerBlogPostList from "./@components/BlogPostServer";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Blog.metadatas.title"),
  });
};
export default function BlogPage() {
  const secret = chosenSecret();

  return (
    <div>
      <ServerBlogPostList
        secret={secret}
      />
    </div>
  );
}
