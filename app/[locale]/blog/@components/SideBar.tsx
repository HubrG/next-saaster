import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  getCategoriesForPublishedPosts,
  getTagsForPublishedPosts,
} from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { Link } from "@/src/lib/intl/navigation";
import { Bookmark, Tags } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { v4 } from "uuid";

export default async function SideBar() {
  const t = await getTranslations();
  const categoriesResponse = await getCategoriesForPublishedPosts({
    secret: chosenSecret(),
  });
  const tagsResponse = await getTagsForPublishedPosts({
    secret: chosenSecret(),
  });

  const categories = categoriesResponse.data?.success || [];
  const tags = tagsResponse.data?.success || [];

  return (
    <Suspense fallback={<SkeletonLoader />}  >

    <div className="blog-sidebar">
      <div className=" max-h-[28vh]">
        <h2 className="mb-2 text-lg flex flex-row items-center justify-between">
          {t("Blog.category")}
          <Bookmark className="icon" />
        </h2>
        <ScrollArea className="h-full w-full p-3 border-app-200 bg-theming-background-100 rounded-md border">
          <ul>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={v4() + category.id}>
                  <Link href={`/blog/categorie/${category.slug}` as any}>
                    {category.name}
                  </Link>
                </li>
              ))
            ) : (
              <li>Aucune catégorie</li>
            )}
          </ul>
        </ScrollArea>
      </div>
      <div className="max-h-[51vh]">
        <h2 className="mb-2 text-lg flex flex-row items-center justify-between mt-14">
          {t("Blog.tags")}
          <Tags className="icon" />
        </h2>
        <ScrollArea className="h-full p-3 w-full border-app-200 bg-app-50 rounded-md bg-theming-background-100 border">
          <ul className="flex flex-col h-full gap-y-2 text-base">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <li key={v4() + tag.id}>
                  <Link
                    href={`/blog/tag/${tag.slug}` as any}
                    className="font-normal italic"
                    style={{ fontWeight: "light" }}>
                    <span className="font-normal">{tag.name}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li>Aucun tag</li>
            )}
          </ul>
        </ScrollArea>
      </div>
      </div>
       </Suspense>
  );
}
