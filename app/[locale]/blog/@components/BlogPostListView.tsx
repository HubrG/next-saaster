import { Link } from "@/src/lib/intl/navigation";
import { BlogPost } from "@prisma/client";
import Image from "next/image";
import React from "react";

import { v4 } from "uuid";

interface BlogPostListProps {
  blogPosts: BlogPost[];
}
interface CustomBlogPost extends BlogPost {
  category?: {
    name: string;
    slug: string;
  } | null;
  tags?:
    | {
        id: string;
        name: string;
        slug: string;
      }[]
    | null;
}
const BlogPostListView: React.FC<BlogPostListProps> = ({ blogPosts }) => {
  return (
    <div className="flex flex-col gap-10 w-full">
      {blogPosts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((post: CustomBlogPost) => (
          <>
            {post.published && (
              <div key={v4() + post.id}>
                {/* <MotionShow animation="bounceIn">
                  <MotionHover
                    scale={1.005}
                    shadow={"0 15px 50px -12px var(--color-app3)"}
                    type={"grow"}> */}
                <div className="flex flex-col gap-5 rounded-lg p-5 items-start border-b-2 border-b-app-200">
                  <div className="flex w-full flex-row items-center mb-1 justify-between">
                    <p>
                      <small>
                        Le{" "}
                        {post.publishedAt
                          ?.toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(",", " à")}
                      </small>
                    </p>
                    {post.category && (
                      <Link
                        href={`/blog/category/${post.category?.slug}` as any}
                        className="text-sm">
                        {post.category?.name}
                      </Link>
                    )}
                  </div>
                  <Link
                    className="nunderline flex flex-col gap-2 -mt-6"
                    href={`/blog/read/${post.id}/${post.canonicalSlug}` as any}>
                    <div className="w-full relative">
                      <div className="relative w-full h-32 mx-auto rounded-lg overflow-hidden">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title ? post.title : "Aucun titre"}
                            width={900}
                            height={200}
                            className="object-cover"
                            priority={true}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <h2 className="mt-2">{post.title}</h2>
                    <p className="-mt-2 font-normal">
                      {post.excerpt ? post.excerpt : ""}
                    </p>
                  </Link>
                  <div className="flex flex-row flex-wrap gap-2 text-sm italic opacity-80">
                    {post.tags &&
                      post.tags.map((tag: any) => (
                        <div key={v4() + tag.id} className="tag-label">
                          <Link
                            className="cursor-pointer"
                            href={`/blog/tag/${tag.tag.slug}` as any}>
                            {tag.tag.name}
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
                {/* </MotionHover>
                </MotionShow> */}
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default BlogPostListView;
