"use server";
import { isMoreThanUser } from "@/src/helpers/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import slugify from "react-slugify";

// We create a function to verify if the user is logged not a "USER" role (ADMIN, EDITOR, SUPER_ADMIN)
const isAuthorized = async () => {
  const user = await isMoreThanUser();
  if (!user) {
    return null;
  }
  return user;
};

export const createNewPost = async () => {
  const user = await isAuthorized();
  if (!user) {
    throw new Error("User not authorized");
  }
  const newPost = await prisma.blogPost.create({
    data: {
      title: "",
      content: "",
      published: false,
      authorId: user.userId,
    },
  });
  return newPost;
};



export const saveEditPost = async ({
  id,
  title,
  content,
  image,
  canonicalSlug,
  excerpt,
  published,
  category,
}: {
  id: string;
  title: string;
  content: string;
  image: string;
  canonicalSlug: string;
  excerpt: string;
  published: boolean;
  category: string | null;
}) => {
  // On sauvegarde l'article
  const user = await isAuthorized();
  if (!user) {
    throw new Error("User not authorized");
  }
  const post = await prisma.blogPost.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
      image: image,
      canonicalSlug: canonicalSlug,
      excerpt: excerpt,
      published: published,
      publishedAt: published ? new Date() : null,
      categoryId: category ? (category === "no" ? null : category) : null,
    },
  });
  return post;
};

export const saveTagsForPost = async (id: string, tagNames: string[]) => {
  const user = await isAuthorized();
  if (!user) {
    throw new Error("User not authorized");
  }
  // Démarrez une transaction Prisma
  return await prisma.$transaction(async (prisma) => {
    // 1. Recherchez les tags existants
    const existingTags = await prisma.blogTag.findMany({
      where: {
        name: {
          in: tagNames,
        },
      },
    });

    // 2. Créez les nouveaux tags
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(
      (tagName) => !existingTagNames.includes(tagName)
    );

    for (const tagName of newTagNames) {
      let slug = slugify(tagName);
      let uniqueSlug = slug;
      let counter = 0;

      // Assurez-vous que le slug est unique
      while (await prisma.blogTag.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${++counter}`;
      }

      // Créez le tag avec un slug unique
      await prisma.blogTag.create({
        data: {
          name: tagName,
          slug: uniqueSlug,
        },
      });
    }

    // 3. Obtenez les IDs des tags à nouveau pour inclure les nouveaux tags
    const allTags = await prisma.blogTag.findMany({
      where: {
        name: {
          in: tagNames,
        },
      },
    });

    // 4. Supprimez les anciennes associations
    await prisma.blogTagOnPost.deleteMany({
      where: {
        postId: id,
      },
    });

    // 5. Créez les nouvelles associations
    const tagPostAssociations = allTags.map((tag) => ({
      tagId: tag.id,
      postId: id,
    }));
    await prisma.blogTagOnPost.createMany({
      data: tagPostAssociations,
      skipDuplicates: true, // Cette option saute les doublons si jamais ils existent
    });
    return true;
  });
};

// Suppression d'un post
export const deletePost = async (id: string) => {
  const user = await isAuthorized();
  if (!user) {
    throw new Error("User not authorized");
  }
  // Exécutez les deux opérations dans une transaction
  await prisma.$transaction(async (prisma) => {
    // Supprimez d'abord les BlogTagOnPost liés
    await prisma.blogTagOnPost.deleteMany({
      where: {
        postId: id,
      },
    });
    // Ensuite, supprimez le post lui-même
    await prisma.blogPost.delete({
      where: {
        id: id,
      },
    });
  });
  return true;
};

// Modificatio ndu status de publication d'un post (published)
export const publishPost = async (id: string, isPublished: boolean) => {
  const user = await isAuthorized();
  if (!user) {
    throw new Error("User not authorized");
  }
  const post = await prisma.blogPost.update({
    where: {
      id: id,
    },
    data: {
      published: isPublished,
      publishedAt: new Date(),
    },
  });
  return post;
};
