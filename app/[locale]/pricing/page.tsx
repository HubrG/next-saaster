import { SwitchRecurrence } from "@/app/[locale]/pricing/components/SwitchRecurrence";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import { getUser } from "@/src/helpers/db/users.action";
import createMetadata from "@/src/lib/metadatas";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PriceCardsFeaturesByCategories } from "./components/PriceCardFeaturesByCategories";
import { PriceCardsSimple } from "./components/PriceCardsSimple";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Pricing",
  });
};

export default async function Pricing({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    const email = session?.user?.email;
    if (email) {
      const user = await getUser({ email: email });
      if (user.data?.subscriptions?.find((sub) => sub.isActive)){
        redirect("/dashboard#Billing");
      }
    }
  }
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex flex-col gap-y-8 ">
        <h1 className="!bg-gradient2">Pricing</h1>
        {/* Display recurrence if not "Pay once" or "Metered" business model */}
        <SwitchRecurrence
        // yearlypercent_off={20}
        // -> display a percentage off for yearly payment
        />
        <PriceCardsSimple />
        {/* If « display features by categories » is activated » */}
        <PriceCardsFeaturesByCategories />
      </div>
    </>
  );
}
