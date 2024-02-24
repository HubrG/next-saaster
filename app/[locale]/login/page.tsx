import { Index } from "@/app/[locale]/login/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Login",
  });
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className=" items-center justify-center ">
        <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
          <Suspense>
            <Index />
          </Suspense>
        </div>
      </div>
    </>
  );
}
