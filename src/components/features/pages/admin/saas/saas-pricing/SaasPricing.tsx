"use client";

import { SubSectionWrapper } from "@/src/components/ui/user-interface/SubSectionWrapper";
import { Features } from "./@subsections/manage-feature/Features";
import { ManagePlans } from "./@subsections/manage-plan/Plans";
import { StripeManager } from "./@subsections/manage-stripe/Stripe";

export const SaasPricing = () => {
  return (
    <div>
      <SubSectionWrapper id="ManagePricing" sectionName="Manage Plans">
        <ManagePlans />
      </SubSectionWrapper>
      <SubSectionWrapper id="ManageFeatures" sectionName="Manage Features">
        <Features />
      </SubSectionWrapper>
      <SubSectionWrapper id="ManageStripe" sectionName="Manage Stripe">
        <StripeManager />
      </SubSectionWrapper>
    </div>
  );
};
