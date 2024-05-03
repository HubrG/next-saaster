import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { Card } from "@/src/components/ui/card";
import createMetadata from "@/src/lib/metadatas";
import { StripeManager } from "../../admin/classes/stripeManager";
import { Index } from "./components/Index";
const stripeManager = new StripeManager();

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Success",
  });
};
export default async function PricingSuccess({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  let getCheckoutSession;
  try {
    getCheckoutSession = await stripeManager.getCheckoutSession(
      searchParams.session_id
    );
  } catch (error) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-tl" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
              <h1>No session retrieved</h1>
              <p className="text-center mt-10">Sorry...</p>
            </Card>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className=" items-center justify-center ">
        <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
          <Index />
        </div>
      </div>
    </>
  );
}
