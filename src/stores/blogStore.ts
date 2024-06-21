import { addCategory, deleteCategory, getBlogCategories, getBlogPosts, updateCategory } from "@/src/helpers/db/blog.action";
import { BlogCategory, iBlog } from "@/src/types/db/iBlog";
import slugify from "react-slugify";
import { create } from "zustand";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";

type Store = {
  blogPosts: iBlog[];
  setBlogPosts: (
    updater: ((currentPosts: iBlog[]) => iBlog[]) | iBlog[]
  ) => void;
  fetchBlogPosts: () => Promise<void>;
  isBlogStoreLoading: boolean;
  setBlogStoreLoading: (loading: boolean) => void;
  updateBlogPostFromStore: (
    postId: string,
    newPostData: Partial<iBlog>
  ) => void;
  deleteBlogPostFromStore: (postId: string) => void;
  blogCategories: BlogCategory[];
  setBlogCategories: (
    updater:
      | ((currentCategories: BlogCategory[]) => BlogCategory[])
      | BlogCategory[]
  ) => void;
  fetchBlogCategories: () => Promise<void>;
  addBlogCategoryToStore: (newCategory: BlogCategory) => void;
  updateBlogCategoryFromStore: (
    categoryId: string,
    newCategoryData: Partial<BlogCategory>
  ) => void;
  deleteBlogCategoryFromStore: (categoryId: string) => void;
};

export const useBlogStore = create<Store>()((set) => ({
  blogPosts: [],
  isBlogStoreLoading: false,
  setBlogStoreLoading: (loading) => {
    set({ isBlogStoreLoading: loading });
  },
  setBlogPosts: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({
        blogPosts: updater(state.blogPosts),
        isBlogStoreLoading: false,
      }));
    } else {
      set({ blogPosts: updater, isBlogStoreLoading: false });
    }
  },
  updateBlogPostFromStore: (postId, newPostData) => {
    set((state) => ({
      blogPosts: state.blogPosts.map((post) =>
        post.id === postId ? { ...post, ...newPostData } : post
      ),
    }));
  },
  fetchBlogPosts: async () => {
    set({ isBlogStoreLoading: true });
    const blogPosts = await getBlogPosts({ secret: chosenSecret() });
    if (!blogPosts.data?.success) {
      set({ isBlogStoreLoading: false });
      console.error(blogPosts.serverError || "Failed to fetch blog posts");
    }
    set({ blogPosts: blogPosts.data?.success, isBlogStoreLoading: false });
  },
  deleteBlogPostFromStore: (postId) => {
    // On supprime totalement le post de la liste
    set((state) => ({
      blogPosts: state.blogPosts.filter((post) => post.id !== postId),
    }));
  },
  blogCategories: [],
  setBlogCategories: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({
        blogCategories: updater(state.blogCategories),
      }));
    } else {
      set({ blogCategories: updater });
    }
  },
  fetchBlogCategories: async () => {
    set({ isBlogStoreLoading: true });
    const blogCategories = await getBlogCategories({ secret: chosenSecret() });
    if (!blogCategories.data?.success) {
      set({ isBlogStoreLoading: false });
      console.error(
        blogCategories.serverError || "Failed to fetch blog categories"
      );
    }
    set({
      blogCategories: blogCategories.data?.success,
      isBlogStoreLoading: false,
    });
  },
  addBlogCategoryToStore: async (newCategory) => {
    set({ isBlogStoreLoading: true });
    const response = await addCategory({
      ...newCategory,
      slug: newCategory.slug || "",
      secret: chosenSecret(),
    });
    if (response.data?.success) {
      set((state) => ({
        blogCategories: [
          ...state.blogCategories,
          { ...response?.data?.success!, posts: [] }, 
        ],
        isBlogStoreLoading: false,
      }));
    } else {
      set({ isBlogStoreLoading: false });
      console.error(response.serverError || "Failed to add blog category");
    }
  },
  updateBlogCategoryFromStore: async (categoryId, newCategoryData) => {
    set({ isBlogStoreLoading: true });
    const response = await updateCategory({
      id: categoryId,
      data: {
        ...newCategoryData,
        slug: slugify(newCategoryData.name) ?? "",
      },
      secret: chosenSecret(),
    });
    if (!response.data?.success) {
      set({ isBlogStoreLoading: false });
      console.error(response.serverError || "Failed to update blog category");
    }
    set((state) => ({
      blogCategories: state.blogCategories.map((category) =>
        category.id === categoryId
          ? { ...category, ...response.data?.success }
          : category
      ),
      isBlogStoreLoading: false,
    }));
  },
  deleteBlogCategoryFromStore: async (categoryId) => {
    set({ isBlogStoreLoading: true });
    const response = await deleteCategory({
      id: categoryId,
      secret: chosenSecret(),
    });
    if (!response.data?.success) {
      set({ isBlogStoreLoading: false });
      console.error(response.serverError || "Failed to delete blog category");
    }
    set((state) => ({
      blogCategories: state.blogCategories.filter(
        (category) => category.id !== categoryId
      ),
      isBlogStoreLoading: false,
    }));
  },
}));

export default useBlogStore;
