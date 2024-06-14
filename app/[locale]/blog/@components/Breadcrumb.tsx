"use client";
import { iBlog } from "@/src/types/db/iBlog";
import { CaretRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export const BlogBreadCrumb = ({ post }: { post: iBlog }) => {
  const title = post?.title ?? "";
  const [isMobile, setIsMobile] = useState(false);
  const maxLength = isMobile ? 25 : 100;
  const displayedTitle = title
    ? title.length > maxLength
      ? title.slice(0, maxLength) + "..."
      : title
    : "";

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sticky top-[4.1rem] blog-breadcrumb w-full z-10 bg-theming-background-50/40 backdrop-grayscale dark:backdrop-grayscale-0  backdrop-blur-md dark:bg-theming-background-100/40  dark:backdrop-blur-md">
      <div
        className="flex justify-start px-5 w-full border-b-[1px] border-dashed    py-2 -mt-10 mb-14"
        aria-label="Breadcrumb">
        <ul className="inline-flex items-center list-none justify-start space-x-1 md:space-x-3 text-sm">
          <li>
            <div className="flex items-center">
              <Link href="/blog">Blog</Link>
            </div>
          </li>
          {post.category && (
            <li>
              <div className="flex items-center">
                <CaretRightIcon className="w-4 h-4" />

                <Link
                  className="ml-1 text-base font-medium md:ml-2 "
                  href={`/blog/category/${post.category.slug}`}>
                  {post.category.name}
                </Link>
              </div>
            </li>
          )}

          <li aria-current="page" className="w-full">
            <div className="flex w-full items-center">
              <CaretRightIcon className="w-4 h-4" />
              <div data-tooltip-id="ttTitle" data-tooltip-content={title}>
                <span className="cursor-default ml-1 text-base font-medium text-theming-text-500 md:ml-2 dark:text-theming-text-400">
                  {displayedTitle}
                </span>
                {displayedTitle.length < title.length && (
                  <Tooltip place="bottom" id="ttTitle" className="tooltip" />
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
