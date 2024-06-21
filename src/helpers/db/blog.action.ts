"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, upThanUserAction } from "@/src/lib/safe-actions";
import { iBlog } from "@/src/types/db/iBlog";
import { BlogCategory } from "@prisma/client";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";

/**
 *  Get blog post by ID
 *
 * @param id - The ID of the blog post
 * @returns The blog post object
 */
export const getBlogPost = action(
  z.object({
    id: z.string(),
    secret: z.string().optional(),
  }),
  async ({ id, secret }): Promise<HandleResponseProps<iBlog>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const blogPost = await prisma.blogPost.findUnique({
        where: { id },
        include,
      });
      if (!blogPost) throw new ActionError("No blog post found");
      return handleRes<iBlog>({
        success: blogPost as unknown as iBlog,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iBlog>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getBlogPosts = action(
  z.object({
    secret: z.string().optional(),
    publishedOnly: z.boolean().optional(),
  }),
  async ({ secret, publishedOnly }): Promise<HandleResponseProps<iBlog[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const blogPosts = await prisma.blogPost.findMany({
        where: {
          published: publishedOnly,
        },
        include,
      });
      if (!blogPosts) throw new ActionError("No blog posts found");
      return handleRes<iBlog[]>({
        success: blogPosts as unknown as iBlog[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iBlog[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateBlogPost = upThanUserAction(
  z.object({
    id: z.string(),
    data: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      published: z.boolean().optional(),
    }),
    secret: z.string().optional(),
  }),
  async ({ id, data, secret }): Promise<HandleResponseProps<iBlog>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const blogPost = await prisma.blogPost.update({
        where: { id },
        data,
        include,
      });
      if (!blogPost) throw new ActionError("Problem while updating blog post");
      return handleRes<iBlog>({
        success: blogPost as unknown as iBlog,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iBlog>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const deleteBlogPost = upThanUserAction(
  z.object({
    id: z.string(),
  }),
  async ({ id }, { userSession }): Promise<HandleResponseProps<iBlog>> => {
    // 🔐 Security
    if (!userSession) throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const blogPost = await prisma.blogPost.delete({
        where: { id },
      });
      if (!blogPost) throw new ActionError("Problem while deleting blog post");
      return handleRes<iBlog>({
        success: blogPost as iBlog,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iBlog>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
export const getBlogPostsByTagSlug = action(
  z.object({
    slug: z.string(),
    secret: z.string().optional(),
  }),
  async ({ slug, secret }): Promise<HandleResponseProps<iBlog[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          tags: {
            some: {
              tag: {
                slug: slug,
              },
            },
          },
        },
        include,
      });
      if (!posts) throw new ActionError("No blog posts found");
      return handleRes<iBlog[]>({
        success: posts as unknown as iBlog[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iBlog[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getBlogPostsByCategorySlug = action(
  z.object({
    slug: z.string(),
    secret: z.string().optional(),
  }),
  async ({ slug, secret }): Promise<HandleResponseProps<iBlog[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          category: {
            slug: slug,
          },
        },
        include,
      });
      if (!posts) throw new ActionError("No blog posts found");
      return handleRes<iBlog[]>({
        success: posts as unknown as iBlog[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iBlog[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getBlogCategory = action(
  z.object({
    slug: z.string().optional(),
    secret: z.string().optional(),
  }),
  async ({ slug, secret }): Promise<HandleResponseProps<any>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const rawCategory = await prisma.blogCategory.findUnique({
        where: {
          slug: slug,
        },
      });
      if (!rawCategory) throw new ActionError("No category found");
      return handleRes({
        success: rawCategory,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getBlogCategories = action(
  z.object({
    secret: z.string().optional(),
  }),
  async ({ secret }): Promise<HandleResponseProps<any[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const rawCategories = await prisma.blogCategory.findMany({
        orderBy: {
          name: "asc",
        },
      });
      if (!rawCategories) throw new ActionError("No categories found");
      return handleRes({
        success: rawCategories,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getTagsForPublishedPosts = action(
  z.object({
    slug: z.string().optional(),
    secret: z.string().optional(),
  }),
  async ({ slug, secret }): Promise<HandleResponseProps<any[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const tags = await prisma.blogTag.findMany({
        where: {
          slug: slug,
          posts: {
            some: {
              post: {
                published: true,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
      if (!tags) throw new ActionError("No tags found");
      return handleRes({
        success: tags,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getCategoriesForPublishedPosts = action(
  z.object({
    slug: z.string().optional(),
    secret: z.string().optional(),
  }),
  async ({ slug, secret }): Promise<HandleResponseProps<any[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const posts = await prisma.blogCategory.findMany({
        where: {
          slug: slug,
          posts: {
            some: {
              published: true,
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
      if (!posts) throw new ActionError("No categories found");
      return handleRes({
        success: posts,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getBlogTag = action(
  z.object({
    slug: z.string().optional(),
    secret: z.string().optional(),
  }),
  async ({ slug, secret }): Promise<HandleResponseProps<any>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const rawSlug = await prisma.blogTag.findUnique({
        where: {
          slug: slug,
        },
      });
      if (!rawSlug) throw new ActionError("No tag found");
      return handleRes({
        success: rawSlug,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getBlogTags = action(
  z.object({
    secret: z.string().optional(),
  }),
  async ({ secret }): Promise<HandleResponseProps<any[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const rawTags = await prisma.blogTag.findMany({
        orderBy: {
          name: "asc",
        },
      });
      if (!rawTags) throw new ActionError("No tags found");
      return handleRes({
        success: rawTags,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
export const addCategory = upThanUserAction(
  z.object({
    name: z.string(),
    slug: z.string(),
    secret: z.string().optional(),
  }),
  async ({
    name,
    slug,
    secret,
  }): Promise<HandleResponseProps<BlogCategory>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const category = await prisma.blogCategory.create({
        data: { name, slug },
      });
      return handleRes<BlogCategory>({
        success: category,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<BlogCategory>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateCategory = upThanUserAction(
  z.object({
    id: z.string(),
    data: z.object({
      name: z.string().optional(),
      slug: z.string().optional(),
    }),
    secret: z.string().optional(),
  }),
  async ({ id, data, secret }): Promise<HandleResponseProps<BlogCategory>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const category = await prisma.blogCategory.update({
        where: { id },
        data,
      });
      return handleRes<BlogCategory>({
        success: category,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<BlogCategory>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
export const deleteCategory = upThanUserAction(
  z.object({
    id: z.string(),
    secret: z.string().optional(),
  }),
  async ({ id, secret }): Promise<HandleResponseProps<BlogCategory>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const category = await prisma.blogCategory.delete({
        where: { id },
      });
      return handleRes<BlogCategory>({
        success: category,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<BlogCategory>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
const include = {
  author: true,
  comments: true,
  tags: {
    include: {
      tag: true,
    },
  },
  category: true,
};
