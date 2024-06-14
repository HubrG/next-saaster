"use client";
import { SectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SectionWrapper";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Rss } from "lucide-react";
import BlogPostList from "./manage-posts/@subcomponents/BlogPostList";
import { CreatePost } from "./manage-posts/@subcomponents/CreatePostButton";

export const AdminBlog = () => {
  return (
    <>
      <SectionWrapper
        id="BlogPosts"
        sectionName="Manage posts"
        mainSectionName="Blog"
        icon={<Rss className="icon" />}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-3">
          <CreatePost />
          {/* {session.user.id ? <CreatePostIA userId={session.user.id} /> : null} */}
        </div>
        <Separator className="mt-5 mb-0" />
        <BlogPostList />
      </SectionWrapper>
    </>
  );
};
