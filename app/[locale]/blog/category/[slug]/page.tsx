import { getBlogCategory } from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import createMetadata, { MetadataParams } from "@/src/lib/metadatas";
import { BlogCategory } from "@prisma/client";
import { Bookmark } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import BlogPostList from "../../@components/BlogPostList";

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
    url: process.env.NEXT_PUBLIC_URI + "/blog/category/" + params.slug,
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
          {category?.slug && <BlogPostList categorySlug={category?.slug} />}
        </div>
      </div>
    </>
  );
}
