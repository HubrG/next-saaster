import { getBlogTag } from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import createMetadata from "@/src/lib/metadatas";
import { Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ServerBlogPostList from "../../@components/BlogPostServer";
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

export default async function BlogPostsByTag({
  params,
}: {
  params: { method: string; slug: string; id: string };
}) {
  const tag = (await getBlogTag({ slug: params.slug, secret: chosenSecret() })).data?.success || {};
  const secret = chosenSecret();

  return (
    <>
      <h1 className="flex flex-col justify-left gap-1 items-start">
        <Link href="/blog">Blog</Link>
        {tag?.name && (
          <small className="flex flex-row items-baseline mt-1">
            <div className="flex flex-row text-lg  items-baseline pt-1">
              <Tag className="icon" />
              {tag.name}
            </div>
          </small>
        )}
      </h1>
      <div className="flex md:flex-row flex-col gap-5">
        <div className="w-full">
          {tag?.slug && (
            <ServerBlogPostList tagSlug={params.slug} secret={secret} />
          )}
        </div>
      </div>
    </>
  );
}
