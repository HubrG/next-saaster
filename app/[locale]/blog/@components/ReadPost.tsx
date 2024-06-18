import { Bookmark, Tag } from "lucide-react";
import Image from "next/image";

import { Link } from "@/src/lib/intl/navigation";
import { iBlog } from "@/src/types/db/iBlog";
import React, { Suspense } from "react";
import { v4 } from "uuid";
import { BlogBreadCrumb } from "./Breadcrumb";


interface BlogPostProps {
  blogPost: iBlog;
}

export const ReadPost: React.FC<BlogPostProps> = ({ blogPost }) => {
  return (
    <>
      {blogPost.content && blogPost.title ? (
        <>
          <Suspense fallback={<p className="text-center">...</p>}>
            <BlogBreadCrumb post={blogPost} />
          </Suspense>
          <article>
            <h1 className="text-left my-5">{blogPost.title}</h1>
            {blogPost.image && (
              <div className="h-[35vh] w-full relative object-cover">
                <Image
                  src={blogPost.image}
                  alt={blogPost.title ?? "Aucun"}
                  fill
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 576px"
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div
              className="mt-14"
              dangerouslySetInnerHTML={{
                __html: blogPost.content,
              }}
            />
           
            <div className="flex flex-col gap-5  my-10">
              {blogPost.category && (
                <div className="inline-flex gap-3 items-center flex-wrap ">
                  <Bookmark className="icon" />
                  <Link
                    href={`/blog/category/${blogPost.category.slug}` as any}>
                    {blogPost.category.name}
                  </Link>
                </div>
              )}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="inline-flex gap-3 items-center flex-wrap ">
                  <Tag className="icon" />
                  {blogPost.tags.map((tag) => (
                    <React.Fragment key={v4() + tag.tag.id}>
                      <Link href={`/blog/tag/${tag.tag.slug}` as any}>
                        {tag.tag.name}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </article>
        </>
      ) : (
        <div className="text-center">
          <h1>Aucun article</h1>
        </div>
      )}
    </>
  );
};
