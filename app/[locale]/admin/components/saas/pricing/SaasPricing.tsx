"use client";
import { Loader } from "@/src/components/ui/@blitzinit/loader";
import { SubSectionWrapper } from "@/src/components/ui/@blitzinit/user-interface/SubSectionWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/@shadcn/tabs";
import { useIsClient } from "@/src/hooks/utils/useIsClient";
import { Suspense } from "react";
import { AlertFrame } from "./@subcomponents/AlertFrame";
import { Features } from "./@subsections/manage-feature/Features";
import { ManagePlans } from "./@subsections/manage-plan/ManagePlans";
import { ManageCoupons } from "./@subsections/manage-plan/ManageStripeCoupons";

export const SaasPricing = () => {
  const isClient = useIsClient();
  if (!isClient) {
    return <Loader />;
  }
  return (
    <div>
      <SubSectionWrapper
        id="ManagePricing"
        sectionName="Manage Plans"
        info="All the plans and coupons you create will also be created in your Stripe account. What's more, every change you make will be reflected in your Stripe plan and coupons created.">
        <AlertFrame />
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plan">Plans</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
          </TabsList>
          <TabsContent value="plan">
            <Suspense fallback={<Loader noHFull />}>
              <ManagePlans />
            </Suspense>
          </TabsContent>
          <TabsContent value="coupons">
            <Suspense fallback={<Loader noHFull />}>
              <ManageCoupons />
            </Suspense>
          </TabsContent>
        </Tabs>
      </SubSectionWrapper>
      <SubSectionWrapper
        id="ManageFeatures"
        sectionName="Manage Features"
        info="Link any feature to any plan, or even to several plans. In addition to simply displaying the feature on the plan to inform the user of what they are subscribing to, when a user selects and subscribes to a plan, all the feature options linked to that plan will be assigned to them as soon as they are purchased. This allows you to better manage the use of each of these features according to their use within a function, by managing them via their  « alias »">
        <Suspense fallback={<Loader noHFull />}>
          <Features />
        </Suspense>
      </SubSectionWrapper>
    </div>
  );
};
