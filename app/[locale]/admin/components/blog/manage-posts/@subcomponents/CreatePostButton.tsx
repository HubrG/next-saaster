"use client";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { createNewPost } from "../../../../queries/blog/blog.action";

import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import useBlogStore from "@/src/stores/blogStore";
import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export const CreatePost = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const router = useRouter();
  const { fetchBlogPosts } = useBlogStore();

  const handleClick = async () => {
    setIsCreating(true); 
    try {
      const res = await createNewPost();
      if (res && res.id) {
        router.push(`/admin/blog/edit/${res.id}/article`);
        fetchBlogPosts();
        router.refresh();
      } else {
        toaster({
          description: "Impossible de créer un nouvel article",
          type: "error",
        });
      }
    } catch (error) {
      toaster({
        description: "Une erreur est survenue lors de la création de l'article",
        type: "error",
      });
      setIsCreating(false);
    } finally {
    }
  };


  return (
    <>
      <Button
        variant={"outline"}
        disabled={isCreating}
        className="flex shadow gap-2 h-auto py-2"
        onClick={handleClick}>
        {isCreating ? (
          <SimpleLoader className="mr-2 h-4 w-4" />
        ) : (
          <FilePlus className="icon" />
        )}
        Create a new post
      </Button>
    </>
  );
};
