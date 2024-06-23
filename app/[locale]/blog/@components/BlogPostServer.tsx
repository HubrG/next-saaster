import { getBlogPosts } from "@/src/helpers/db/blog.action";
import BlogPostList from "./BlogPostList";

type Props = {
  tagSlug?: string;
  categorySlug?: string;
  secret: string;
};

export default async function ServerBlogPostList({
  tagSlug,
  categorySlug,
  secret,
}: Props) {
  let blogPosts = [];

  if (tagSlug) {
    const { data } = await getBlogPosts({ secret, publishedOnly: true });
    blogPosts = data?.success || [];
  } else if (categorySlug) {
    const { data } = await getBlogPosts({ secret, publishedOnly: true });
    blogPosts = data?.success || [];
  } else {
    const { data } = await getBlogPosts({ secret, publishedOnly: true });
    blogPosts = data?.success || [];
  }

  return <BlogPostList blogPosts={blogPosts} />;
}
