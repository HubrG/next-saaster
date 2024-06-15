"use client";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useBlogPosts } from "@/src/queries/useBlogQuery";
import BlogPostListView from "./BlogPostListView";

type Props = {
  tagSlug?: string;
  categorySlug?: string;
};

export default function BlogPostList({ tagSlug, categorySlug }: Props) {
  const secret = chosenSecret();

  const { data: blogPostsByTag } = useBlogPosts(
    secret,
    tagSlug ? true : undefined
  );
  const { data: blogPostsByCategory } = useBlogPosts(
    secret,
    categorySlug ? true : undefined
  );
  const { data: allBlogPosts } = useBlogPosts(
    secret,
    !tagSlug && !categorySlug ? true : undefined
  );

  let blogPosts = [];
  if (tagSlug) {
    blogPosts = blogPostsByTag?.data?.success || [];
  } else if (categorySlug) {
    blogPosts = blogPostsByCategory?.data?.success || [];
  } else {
    blogPosts = allBlogPosts?.data?.success || [];
  }

  return (
    <div className="mt-10">
      <BlogPostListView blogPosts={blogPosts} />
    </div>
  );
}
