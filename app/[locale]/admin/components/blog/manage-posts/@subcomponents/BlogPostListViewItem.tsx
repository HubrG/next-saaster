import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Switch } from "@/src/components/ui/switch";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { Link } from "@/src/lib/intl/navigation";
import useBlogStore from "@/src/stores/blogStore";
import { BlogPost } from "@prisma/client";
import { Bot, Delete, Edit, Eye } from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { Tooltip } from "react-tooltip";
import { deletePost, publishPost } from "../../../../queries/blog/blog.action";

interface CustomBlogPost extends BlogPost {
  category?: {
    name: string;
  } | null;
}

interface BlogPostProps {
  post: CustomBlogPost;
}

const BlogPostListViewItem: React.FC<BlogPostProps> = ({ post }) => {
  const { updateBlogPostFromStore, deleteBlogPostFromStore } = useBlogStore();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isTrashing, setIsTrashing] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState<boolean>(
    post.published ? true : false
  );
  const [isTrashed, setIsTrashed] = useState<boolean>(false);

  const handleTrashBlogPost = async (id: string) => {
    setIsTrashing(id);
    try {
      const trashPost = await deletePost(id);
      if (!trashPost) {
        toaster({
          description: "An error occurred while deleting the post",
          type: "error",
        });
      } else {
        toaster({
          description: "Post deleted successfully",
          type: "success",
        });
        deleteBlogPostFromStore(id);
        setIsTrashed(true);
      }
    } catch (error) {
      toaster({
        description: "An error occurred while communicating with the server",
        type: "error",
      });
    } finally {
      setIsTrashing(null);
    }
  };

  const handlePublishChange = async (postId: string, newValue: boolean) => {
    setIsUpdating(postId);
    startTransition(async () => {
      try {
        const response = await publishPost(postId, newValue);
        if (response) {
          toaster({
            description: `Post ${newValue ? "published" : "unpublished"}`,
            type: "success",
          });
          updateBlogPostFromStore(postId, { published: newValue });
        } else {
          toaster({
            description: "An error occurred while updating the post",
            type: "error",
          });
        }
      } catch (error) {
        toaster({
          description: "An error occurred while communicating with the server",
          type: "error",
        });
      } finally {
        setIsUpdating(null);
        
      }
    });
  };

  return (
    <TableRow className={`${isTrashed && "hidden"} !text-xs`}>
      <TableCell className="text-right text-xs">
        <div data-tooltip-id="ttEdit" data-tooltip-content={"Update"}>
          <Link
            href={
              `/admin/blog/edit/${post.id ?? ""}/${
                post.title ? post.title : "article"
              }` as any
            }>
            <Edit className="icon" />
          </Link>
          <Tooltip id="ttEdit" className="tooltip" />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div data-tooltip-id="ttEye" data-tooltip-content={"Show preview"}>
          <Link
            target="_blank"
            href={
              `/blog/read/${post.id}/${post.canonicalSlug ?? "no-slug"}` as any
            }>
            <Eye className="icon" />
          </Link>
          <Tooltip id="ttEye" className="tooltip" />
        </div>
      </TableCell>
      <TableCell className="text-right text-xs">
        {post.image && (
          <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden">
            <Image
              src={post.image}
              alt={post.title ? post.title : ""}
              fill
              sizes="(max-width: 100) 10vw, (max-width: 100) 10vw, 13vw"
              className="object-cover"
            />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium text-sm">
        <span className={!post.title ? "italic opacity-50 " : ""}>
          {post.isIA && <Bot className="icon" />}
          {post.title ? post.title : `Sans titre`}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={isPublished}
          onCheckedChange={(newValue: any) => {
            handlePublishChange(post.id, newValue);
            setIsPublished(newValue);
          }}
          disabled={isPending && isUpdating === post.id}
          onClick={(e: any) => {
            setIsUpdating(post.id);
          }}
          className={`${isPending && isUpdating === post.id ? "hidden" : ""}`}
        />
        {isPending && isUpdating === post.id && (
          <SimpleLoader className="mx-auto" />
        )}
      </TableCell>
      <TableCell className="text-sm">{post.category?.name}</TableCell>
      <TableCell className="text-center  text-xs">
        {post.createdAt.toLocaleString()}
      </TableCell>
      <TableCell className="text-center  text-xs">
        {post.publishedAt ? post.publishedAt.toLocaleString() : ""}
      </TableCell>
      <TableCell className="text-center text-xs">
        {post.updatedAt.toLocaleString()}
      </TableCell>
      <TableCell className="text-center">
        <div
          className={`${isTrashing === post.id && "hidden"}`}
          data-tooltip-id="ttTrash"
          data-tooltip-content={"Delete"}>
          <Delete
            className="icon cursor-pointer"
            onClick={() => handleTrashBlogPost(post.id)}
          />
          <Tooltip id="ttTrash" className="tooltip" />
        </div>
        {isTrashing === post.id && <SimpleLoader className="mx-auto" />}
      </TableCell>
    </TableRow>
  );
};

export default BlogPostListViewItem;
