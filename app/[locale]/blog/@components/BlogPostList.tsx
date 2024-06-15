import { getBlogPosts, getBlogPostsByCategorySlug, getBlogPostsByTagSlug } from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import BlogPostListView from "./BlogPostListView";
type Props = {
  tagSlug?: string;
  categorySlug?: string;
};
export default async function BlogPostList({ tagSlug, categorySlug }: Props) {
console.log('tagSlug', tagSlug, 'categorySlug', categorySlug);
  let blogPosts = [];
  if (tagSlug) {
    const response = await getBlogPostsByTagSlug({slug: tagSlug, secret: chosenSecret()});
    blogPosts = response.data?.success || [];
  } else if (categorySlug) {
    const response = await getBlogPostsByCategorySlug({
      slug: categorySlug,
      secret: chosenSecret(),
    });
    blogPosts = response.data?.success || [];
  } else {
    const response = await getBlogPosts({
      publishedOnly: true,
      secret: chosenSecret(),
    });
    blogPosts = response.data?.success || [];
  }
  return (
    <div className="mt-10">
      <BlogPostListView blogPosts={blogPosts} />
    </div>
  );
}