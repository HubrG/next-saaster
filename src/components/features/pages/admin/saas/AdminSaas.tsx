"use client";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { PricingFeatureCategory, appSettings } from "@prisma/client";
import { SaasPricing } from "./pricing-settings/SaasPricing";
import { AdminSaasSettings } from "./saas-settings/AdminSaasSettings";

type Props = {
  appSettings: appSettings;
  featureCategories: PricingFeatureCategory[];
};

export const AdminSaas = () => {
  return (
    <>
      <SectionWrapper id="SaasSettings" sectionName="SaaS settings">
        <AdminSaasSettings />
      </SectionWrapper>
      <SectionWrapper id="Pricing" sectionName="SaaS pricing">
        <SaasPricing />
      </SectionWrapper>
    </>
  );
};
