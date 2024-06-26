"use client";
import useBlogStore from "@/src/stores/blogStore";
import BlogPostListView from "./BlogPostListView";

export default  function BlogPostList() {
  const { blogPosts } = useBlogStore();
  return (
    <div>
      <br />
      <BlogPostListView blogPosts={blogPosts} />
    </div>
  );
}
