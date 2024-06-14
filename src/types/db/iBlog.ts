import {
  BlogCategory as PrismaBlogCategory,
  BlogComment as PrismaBlogComment,
  BlogPost as PrismaBlogPost,
  BlogTag as PrismaBlogTag,
  BlogTagOnPost as PrismaBlogTagOnPost,
  User,
} from "@prisma/client";

export interface iBlog extends PrismaBlogPost {
  author: BlogAuthor;
  comments: BlogComment[];
  tags: BlogTagOnPost[];
  category?: BlogCategory | null;
}

export interface BlogCategory extends PrismaBlogCategory {
  posts: iBlog[];
}

export interface BlogComment extends PrismaBlogComment {
  author: BlogAuthor;
  post: iBlog;
}

export interface BlogTag extends PrismaBlogTag {
  posts: BlogTagOnPost[];
}

export interface BlogTagOnPost extends PrismaBlogTagOnPost {
  tag: BlogTag;
  post: iBlog;
}

export interface BlogAuthor extends User {
  id: string;
  name: string;
  email: string;
  // Add other fields as necessary
}
