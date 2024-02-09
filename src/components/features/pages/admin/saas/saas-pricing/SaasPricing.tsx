import { SubSectionWrapper } from "@/src/components/ui/user-interface/SubSectionWrapper";
import { Features } from "./@subsections/manage-feature/Features";
import { ManagePlans } from "./@subsections/manage-plan/MRRS/Plans";
import { StripeManager } from "./@subsections/manage-stripe/Stripe";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { ManageCoupons } from "./@subsections/manage-plan/Coupons";
import { AlertFrame } from "./@subcomponents/AlertFrame";



export const SaasPricing = async () => {
 
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
            <ManagePlans />
          </TabsContent>
          <TabsContent value="coupons">
            <ManageCoupons />
          </TabsContent>
        </Tabs>
      </SubSectionWrapper>
      <SubSectionWrapper
        id="ManageFeatures"
        sectionName="Manage Features"
        info="Link any feature to any plan, or even to several plans. In addition to simply displaying the feature on the plan to inform the user of what they are subscribing to, when a user selects and subscribes to a plan, all the feature options linked to that plan will be assigned to them as soon as they are purchased. This allows you to better manage the use of each of these features according to their use within a function, by managing them via their  « alias »">
        <Features />
      </SubSectionWrapper>
      <SubSectionWrapper id="ManageStripe" sectionName="Manage Stripe">
        <StripeManager />
      </SubSectionWrapper>
    </div>
  );
};
