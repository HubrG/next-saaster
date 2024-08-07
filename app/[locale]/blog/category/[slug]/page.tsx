import { getBlogCategory } from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import createMetadata, { MetadataParams } from "@/src/lib/metadatas";
import { env } from "@/src/lib/zodEnv"; // Importer les variables d'environnement validées
import { BlogCategory } from "@prisma/client";
import { Bookmark } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ServerBlogPostList from "../../@components/BlogPostServer";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const t = await getTranslations();

  return createMetadata({
    title: `Blog | ${params.slug}`,
    description: `Blog posts by category ${params.slug}`,
    type: "website",
    // imgPath: blogPost?.image ? blogPost?.image : "",
    url: env.NEXT_PUBLIC_URI + "/blog/category/" + params.slug,
  } as MetadataParams);
};
export default async function BlogPostsByCategory({
  params,
}: {
  params: { method: string; slug: string; id: string };
}) {
  const cat =
    (await getBlogCategory({ slug: params.slug, secret: chosenSecret() })) ||
    {};

  if (handleError(cat).error) {
    return handleError(cat).error;
  }
  const secret = chosenSecret();

  const category = cat.data?.success as BlogCategory;

  return (
    <>
      <h1 className="flex flex-col justify-left gap-1 items-start">
        <Link href="/blog">Blog</Link>
        {category && (
          <small className="flex flex-row items-baseline mt-1">
            <div className="flex flex-row text-lg  items-baseline pt-1">
              <Bookmark className="icon" /> {category.name}
            </div>
          </small>
        )}
      </h1>
      <div className="flex md:flex-row flex-col gap-5">
        <div className="w-full">
          {category?.slug && (
            <ServerBlogPostList tagSlug={params.slug} secret={secret} />
          )}
        </div>
      </div>
    </>
  );
}
