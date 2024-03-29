import { Index } from "@/app/[locale]/register/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import { redirect } from "@/src/lib/intl/navigation";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Register",
  });
};

export default async function RegisterPage() {
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
            <Index  />
          </Suspense>
        </div>
      </div>
    </>
  );
}
