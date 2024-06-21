import { getBlogPost } from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import createMetadata, { MetadataParams } from "@/src/lib/metadatas";
import { iBlog } from "@/src/types/db/iBlog";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { stripHtml } from "string-strip-html";
import { ReadPost } from "../../../@components/ReadPost";



export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const t = await getTranslations();
  const blogP = await getBlogPost({
    id: params.slug,
    secret: chosenSecret(),
  });

  if (handleError(blogP).error) {
    throw new Error(t("Blog.404"));
  }
  const blogPost = blogP.data?.success as iBlog;
  const description = blogPost?.excerpt
    ? blogPost?.excerpt
    : stripHtml(blogPost?.content ?? "").result.slice(0, 170);
  let descriptionSliced;
  // On réduit la taille de la description à 170 caractères maximum
  if (description && description.length > 170) {
    descriptionSliced = description.slice(0, 167) + "...";
  } else {
    descriptionSliced = description;
  }
  const title = blogPost?.title
    ? blogPost?.title + " | Blog "
    : t("Blog.Metadatas.no-title") + " | Blog";
  return createMetadata({
    title: title,
    description: descriptionSliced,
    type: "article",
    imgPath: blogPost?.image ? blogPost?.image : "",
    url:
      process.env.NEXT_PUBLIC_URI +
      "/blog/read/" +
      blogPost?.id +
      "/" +
      blogPost?.canonicalSlug,
    tags:
      blogPost.tags?.map((t) => t.tag?.name).filter((name) => name != null) ||
      [],
    publishedTime: blogPost?.publishedAt?.toISOString(),
    modifiedTime: blogPost?.updatedAt?.toISOString(),
    authors: [blogPost.author?.name || t("Blog.no-author")],
    twitterCreator: "@FairySaas",
  } as MetadataParams);
};

export default async function ReadBlogPost({
  params,
}: {
  params: { method: string; slug: string; id: string };
}) {
  const t = await getTranslations();
  const blogPost = (
    await getBlogPost({ id: params.slug, secret: chosenSecret() })
  ).data?.success as iBlog;

  if (!blogPost || !blogPost.published) {
    return <>{t("Blog.404")}</>;
  }
  // SCHEMA JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    image: blogPost.image,
    author: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_APP_NAME,
      url: process.env.NEXT_PUBLIC_RELATIVE_URI,
    },
    url:
      process.env.NEXT_PUBLIC_RELATIVE_URI +
      "/blog/lecture/" +
      blogPost.canonicalSlug +
      "/" +
      blogPost.id,
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: process.env.NEXT_PUBLIC_RELATIVE_URI + "/img/logo.png",
      },
    },
    datePublished: blogPost.publishedAt,
    dateModified: blogPost.updatedAt,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ReadPost blogPost={blogPost} />
    </>
  );
}
