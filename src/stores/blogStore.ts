import { getBlogPosts } from "@/src/helpers/db/blog.action";
import { iBlog } from "@/src/types/db/iBlog";
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
}));

export default useBlogStore;
