"use client";
import { useQuery } from "@tanstack/react-query";
import { getBlogPosts } from "../helpers/db/blog.action";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";
import { handleError } from "../lib/error-handling/handleError";
import { iBlog } from "../types/db/iBlog";

const fetchBlogPosts = async () => {
  const response = await getBlogPosts({ secret: chosenSecret() });
  if (handleError(response).error) {
    console.error(response.serverError || "Failed to fetch blogposts");
    return null;
  }
  if (!response.data?.success) {
    throw new Error(response.serverError || "Failed to fetch blogposts");
  }

  return response.data.success as iBlog[];
};

export const useBlogPostsQuery = () => {
  return useQuery({
    queryKey: ["blogPosts"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => fetchBlogPosts(),
  });
};
