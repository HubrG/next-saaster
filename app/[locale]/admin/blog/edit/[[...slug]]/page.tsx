
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";

import {
  getBlogCategories,
  getBlogPost,
  getBlogTags
} from "@/src/helpers/db/blog.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { redirect } from "@/src/lib/intl/navigation";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";

const EditPost = dynamic(
  () =>
    import(
      "@/app/[locale]/admin/components/blog/manage-posts/@subcomponents/EditPost"
    ),
  {
    ssr: false, 
    loading: () => (
      <div className="w-1/2 mx-auto h-full items-center flex">
        <SkeletonLoader type="page" />
      </div>
    ), 
  }
);

export default async function Admin({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "EDITOR" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    redirect("/");
  }

  // On récupère le post
  const post = await getBlogPost({
    id: params.slug[0],
    secret: chosenSecret(),
  });
  if (handleError(post).error) {
    toaster({
      description: "An error occurred while fetching the post",
      type: "error",
    });
    redirect("/admin/blog");
  }
  const categories = await getBlogCategories({ secret: chosenSecret() });
  const tagsOnPost = post.data?.success?.tags;
  const tags = await getBlogTags({
    secret: chosenSecret(),
  });

  return (
    <>
      <div className="content">
        {post && post.data?.success && categories ? (
          <EditPost
            post={post.data.success}
            categories={categories?.data?.success}
            tagsOnPost={tagsOnPost ? tagsOnPost : undefined}
            tags={tags?.data?.success ? tags?.data?.success : undefined}
          />
        ) : (
          <div>Ce post n&apos;existe pas</div>
        )}
      </div>
    </>
  );
}
