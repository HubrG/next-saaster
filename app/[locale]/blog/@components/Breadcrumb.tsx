"use client";
import { Badge } from "@/src/components/ui/badge";
import { iBlog } from "@/src/types/db/iBlog";
import { CaretRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="sticky top-[4.1rem] blog-breadcrumb w-full z-10 bg-transparent ">
      <div
        className="flex justify-start px-5 w-full    py-2 -mt-10 mb-14"
        aria-label="Breadcrumb">
        <ul className="inline-flex items-center list-none justify-start space-x-1 md:space-x-3 text-sm">
          <li>
            <Badge className="flex items-center">
              <Link href="/blog">Blog</Link>
            </Badge>
          </li>
          <li>
            <CaretRightIcon className="w-4 h-4" />
          </li>
          {post.category && (
            <li className="flex flex-row 5 items-center">
              <Badge className="flex items-center">
                <Link
                  className="text-base font-medium "
                  href={`/blog/category/${post.category.slug}`}>
                  <span className="!text-theming-text-900">
                    {" "}
                    {post.category.name}
                  </span>
                </Link>
              </Badge>
            </li>
          )}

          {/* <li aria-current="page" className="w-full">
            <div className="flex w-full items-center">
              <CaretRightIcon className="w-4 h-4" />
              <Badge data-tooltip-id="ttTitle" data-tooltip-content={title}>
                <span className="cursor-default text-base font-medium text-theming-text-500  dark:text-theming-text-400">
                  {displayedTitle}
                </span>
                {displayedTitle.length < title.length && (
                  <Tooltip place="bottom" id="ttTitle" className="tooltip" />
                )}
              </Badge>
            </div>
          </li> */}
        </ul>
      </div>
    </div>
  );
};
