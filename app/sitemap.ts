import {
  getBlogCategories,
  getBlogPosts,
  getBlogTags,
} from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import mainMenu from "@/src/jsons/main-menu.json";
import { env } from "@/src/lib/zodEnv"; // Importer les variables d'environnement validées
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

interface BlogData {
  blogPosts: Array<{ id: string; canonicalSlug: string; updatedAt: string }>;
  blogTags: Array<{ slug: string }>;
  blogCategories: Array<{ slug: string }>;
}

async function fetchBlogData(): Promise<BlogData> {
  const [blogPosts, blogTags, blogCategories] = await Promise.all([
    getBlogPosts({ secret: chosenSecret(), publishedOnly: true }),
    getBlogTags({ secret: chosenSecret() }),
    getBlogCategories({ secret: chosenSecret() }),
  ]);

  if (!blogPosts.data?.success) throw new Error("Failed to fetch blog posts");
  if (!blogTags.data?.success) throw new Error("Failed to fetch blog tags");
  if (!blogCategories.data?.success)
    throw new Error("Failed to fetch blog categories");

  return {
    blogPosts: blogPosts.data.success.filter(
      (post) => post.canonicalSlug !== null
    ) as unknown as BlogData["blogPosts"],
    blogTags: blogTags.data.success,
    blogCategories: blogCategories.data.success,
  };
}

function createSitemapEntries(
  blogData: BlogData,
  mainMenuLinks: Array<{
    url: string;
    lastModified: Date;
    changeFrequency: "monthly";
    priority: number;
  }>
) {
  const { blogPosts, blogTags, blogCategories } = blogData;

  const posts = blogPosts.map((post) => ({
    url: `${env.NEXT_PUBLIC_URI}/blog/read/${post.id}/${post.canonicalSlug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tags = blogTags.map((tag) => ({
    url: `${env.NEXT_PUBLIC_URI}/blog/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = blogCategories.map((category) => ({
    url: `${env.NEXT_PUBLIC_URI}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: env.NEXT_PUBLIC_URI ?? "",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_URI}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_URI}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_URI}/terms`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${env.NEXT_PUBLIC_URI}/privacy`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    ...mainMenuLinks,
    ...posts,
    ...tags,
    ...categories,
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogData = await fetchBlogData();

  const mainMenuLinks = mainMenu.map((item) => ({
    url: `${env.NEXT_PUBLIC_URI}/${item.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return createSitemapEntries(blogData, mainMenuLinks);
}
