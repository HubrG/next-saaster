"use client";

import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { Suspense } from "react";
import BlogPostListView from "./BlogPostListView";

type Props = {
  blogPosts: any[];
};

export default function BlogPostList({ blogPosts }: Props) {
  return (
    <Suspense fallback={<SkeletonLoader type="page" />}>
      <div className="mt-10">
        <BlogPostListView blogPosts={blogPosts} />
      </div>
    </Suspense>
  );
}
