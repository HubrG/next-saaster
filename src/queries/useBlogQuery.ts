import {
    getBlogCategories,
    getBlogPost,
    getBlogPosts,
    getBlogTags,
} from "@/src/helpers/db/blog.action";
import { useQuery } from "@tanstack/react-query";

export const useBlogPosts = (secret?: string, publishedOnly?: boolean) => {
  return useQuery({
    queryKey: ["blogPosts", secret, publishedOnly],
    queryFn: () => getBlogPosts({ secret, publishedOnly }),
  });
};

export const useBlogPost = (id: string, secret?: string) => {
  return useQuery({
    queryKey: ["blogPost", id, secret],
    queryFn: () => getBlogPost({ id, secret }),
  });
};

export const useBlogCategories = (secret?: string) => {
  return useQuery({
    queryKey: ["blogCategories", secret],
    queryFn: () => getBlogCategories({ secret }),
  });
};

export const useBlogTags = (secret?: string) => {
  return useQuery({
    queryKey: ["blogTags", secret],
    queryFn: () => getBlogTags({ secret }),
  });
};
