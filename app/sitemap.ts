// import {
//   getCategoriesForPublishedPosts,
//   getTagsForPublishedPosts,
//   getBlogPosts,
//   getBlogTags,
// } from "@/src/query/blog.query";

// export default async function sitemap() {
//   const sitemap = [
//     {
//       url: "http://ekoseon.fr/raconter-ses-memoires/tarifs",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/raconter-ses-memoires/fonctionnement",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/raconter-ses-memoires/contact",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/blog",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/foire-aux-questions",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/mentions-legales",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/politique-de-confidentialite",
//       lastModified: new Date(),
//     },
//     {
//       url: "http://ekoseon.fr/conditions-generales-de-vente",
//       lastModified: new Date(),
//     },
//   ];

//   const baseUrl = process.env.NEXT_PUBLIC_RELATIVE_URI;

//   const posts = await getBlogPosts({ publishedOnly: true });

//   const postsUrls =
//     posts?.map((post) => {
//       return {
//         url: `${baseUrl}/blog/lecture/${post.canonicalSlug}/${post.id}`,
//         lastModified: post.createdAt,
//       };
//     }) ?? [];

//   const categories = await getCategoriesForPublishedPosts();
//   const categoriesUrls =
//     categories?.map((category) => {
//       return {
//         url: `${baseUrl}/blog/categorie/${category.slug}`,
//         lastModified: new Date(),
//       };
//     }) ?? [];

//   const tags = await getTagsForPublishedPosts();
//   const tagsUrls =
//     tags?.map((tag) => {
//       return {
//         url: `${baseUrl}/blog/tag/${tag.slug}`,
//         lastModified: new Date(),
//       };
//     }) ?? [];

//   return [
//     {
//       url: baseUrl,
//       lastModified: new Date(),
//     },
//     ...postsUrls,
//     ...categoriesUrls,
//     ...tagsUrls,
//     ...sitemap,
//   ];
// }
