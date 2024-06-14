import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/src/components/ui/table";
import { BlogPost } from "@prisma/client";
import React from "react";
import { v4 } from 'uuid';
import BlogPostListViewItem from "./BlogPostListViewItem";

interface BlogPostListProps {
  blogPosts: BlogPost[];
}
interface CustomBlogPost extends BlogPost {
  category?: {
    name: string;
  } | null;
}
const BlogPostListView: React.FC<BlogPostListProps> = ({ blogPosts }) => {
  return (
    <Table className="">
      <TableHeader>
        <TableRow className="bg-app-50 text-app-500 !text-xs">
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead className="w-[100px] text-app-500 text-xs "></TableHead>
          <TableHead className="text-left text-app-500 text-xs ">Title</TableHead>
          <TableHead className="text-center text-app-500 text-xs ">Status</TableHead>
          <TableHead className="text-center text-app-500 text-xs ">Category</TableHead>
          <TableHead className="text-center text-app-500 text-xs ">Created at</TableHead>
          <TableHead className="text-center text-app-500 text-xs ">Published at</TableHead>
          <TableHead className="text-center text-app-500 text-xs ">Updated at</TableHead>
          <TableHead className="text-center text-app-500 text-xs "></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogPosts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post: CustomBlogPost) => (
            <React.Fragment key={v4() + post.id}>
              <BlogPostListViewItem post={post} />
            </React.Fragment>
          ))}
      </TableBody>
    </Table>
  );
};

export default BlogPostListView;
