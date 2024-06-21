import createMetadata from "@/src/lib/metadatas";
import { getTranslations } from "next-intl/server";
import BlogPostList from "./@components/BlogPostList";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Blog.metadatas.title"),
  });
};
export default async function BlogPage() {
  return (
    <>
      <h1 className="text-left">Blog</h1>
      <div className="flex md:flex-row flex-col gap-5">
        <div className="w-full">
          <BlogPostList />
        </div>
      </div>
    </>
  );
}
