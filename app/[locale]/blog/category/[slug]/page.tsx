import { getBlogCategory } from "@/src/helpers/db/blog.action";
import createMetadata from "@/src/lib/metadatas";
import { Bookmark } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import BlogPostList from "../../@components/BlogPostList";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Index.metadatas.title"),
    description: t("Index.metadatas.description"),
    url: "https://www.example.com",
  });
};
export default async function BlogPostsByCategory({
  params,
}: {
  params: { method: string; slug: string; id: string };
}) {
  const category =
    (await getBlogCategory({ slug: params.slug })).data?.success || {};

  return (
    <>
      <h1 className="flex flex-col justify-left gap-1 items-start">
        <Link href="/blog">Blog</Link>
        {category?.name && (
          <small className="flex flex-row items-baseline mt-1">
            <div className="flex flex-row text-lg  items-baseline pt-1">
              <Bookmark className="icon" /> {category.name}
            </div>
          </small>
        )}
      </h1>
      <div className="flex md:flex-row flex-col gap-5">
        <div className="w-full">
          {category?.slug && <BlogPostList categorySlug={category?.slug} />}
        </div>
      </div>
    </>
  );
}
