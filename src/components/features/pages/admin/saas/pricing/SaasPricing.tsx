"use client";

import { PricingFeatureCategory, appSettings } from "@prisma/client";
import { ManagePricing } from "@/src/components/features/pages/admin/saas/pricing/subsections/ManagePricing";
import { SubSectionWrapper } from "@/src/components/ui/user-interface/SubSectionWrapper";

export const SaasPricing = () => {
  return (
    <div>
      <SubSectionWrapper id="ManagePricing" sectionName="Manage Pricing">
        <ManagePricing />
      </SubSectionWrapper>
    </div>
  );
};
