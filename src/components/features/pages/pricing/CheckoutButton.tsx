"use client";
import { Button } from "@/src/components/ui/button";
import { usePublicSaasPricingStore } from "@/src/stores/admin/publicSaasPricingStore";
import { MRRSPlan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "./queries";
import { MRRSPlanStore } from "@/src/stores/admin/saasMRRSPlansStore";

type Props = {
  plan: MRRSPlanStore;
};
export const CheckoutButton = ({ plan }: Props) => {
   const { isYearly } = usePublicSaasPricingStore();
   const router = useRouter();

  
   const handleClick = async () => {
     // Déterminer l'identifiant de prix approprié en fonction du plan et du choix de facturation
     const priceId = plan.isFree
       ? plan.stripeFreePriceId
       : isYearly
       ? plan.stripeYearlyPriceId
       : plan.stripeMonthlyPriceId;

     if (!priceId) return; 

     // Créer une session de paiement et rediriger l'utilisateur
     const checkoutUrl = await createCheckoutSession(priceId, plan, isYearly ? "yearly" : "monthly");
     if (checkoutUrl) {
       router.push(checkoutUrl);
     }
   };

  return (
    <Button
      onClick={handleClick}
      className="relative mt-5 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-secondary/5 dark:bg-slate-950 px-3 py-1 text-sm font-medium text-text-950 dark:text-primary-foreground backdrop-blur-3xl">
        Select this plan
      </span>
    </Button>
  );
};
