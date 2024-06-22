import { Card } from "@/src/components/ui/card";
import { Link } from "@/src/lib/intl/navigation";
import { BlogPost } from "@prisma/client";
import { motion } from "framer-motion";
import { useFormatter } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};


const BlogPostListView: React.FC<BlogPostListProps> = ({ blogPosts }) => {
  const format = useFormatter();
  const isMobile = useIsMobile();


  return (
    <div className="flex flex-col gap-10 w-full ">
      {blogPosts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((post: CustomBlogPost) => (
          <>
            {post.published && (
              <motion.div
                key={v4() + post.id}
                initial={{ opacity: 0.5, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}>
                <motion.div
                  whileHover={
                    !isMobile
                      ? {
                          scale: 1.005,
                          boxShadow:
                            "0 15px 50px -12px var(--secondary-400-second)",
                        }
                      : {}
                  }>
                  <Card key={v4() + post.id}>
                    <div className="flex flex-col gap-5 p-0 items-start">
                      <div className="flex w-full flex-row items-center mb-1 justify-between">
                        <p className="pt-0">
                          <small className="text-xs">
                            {format.dateTime(
                              typeof post.createdAt === "number"
                                ? post.createdAt
                                : Date.now()
                            )}
                          </small>
                        </p>
                        {post.category && (
                          <Link
                            href={
                              `/blog/category/${post.category?.slug}` as any
                            }
                            className="text-sm text-left">
                            {post.category?.name}
                          </Link>
                        )}
                      </div>
                      <Link
                        className="nunderline flex flex-col gap-2 -mt-6"
                        href={
                          `/blog/read/${post.id}/${post.canonicalSlug}` as any
                        }>
                        <div className="w-full relative">
                          <div className="relative w-full h-32 mx-auto rounded-lg overflow-hidden">
                            {post.image ? (
                              <div className="flex justify-center items-center h-full">
                                <Image
                                  src={post.image}
                                  alt={post.title ? post.title : "Aucun titre"}
                                  width={900}
                                  height={200}
                                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                                  priority
                                  className="object-cover object-center"
                                  lazyBoundary="100px"
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <h2 className="mt-2 text-left max-sm:text-3xl">
                          {post.title}
                        </h2>
                        <p className=" font-normal md:text-base text-sm mt-5 text-justify">
                          {post.excerpt
                            ? post.excerpt.length > 200
                              ? `${post.excerpt.substring(0, 200)}...`
                              : post.excerpt
                            : ""}
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
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </>
        ))}
    </div>
  );
};

export default BlogPostListView;