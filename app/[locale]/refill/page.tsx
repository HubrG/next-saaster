import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import { redirect } from "@/src/lib/intl/navigation";
import createMetadata from "@/src/lib/metadatas";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { Index } from "./components/Index";
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Refill.metadatas.title"),
  });
};
export default async function page() {

  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const saasSettings = await getSaasSettings();

  if (
    !saasSettings.data?.activeRefillCredit ||
    !saasSettings.data?.activeCreditSystem
  ) {
    redirect("/");
  }

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className=" items-center justify-center w-1/2 ">
        <Index />
      </div>
    </>
  );
}
