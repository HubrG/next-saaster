"use client";

import { SectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SectionWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  Building2,
  CircleUser,
  CreditCard,
  Mail,
  UserRoundCog,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ProfileAccount } from "./account/ProfileAccount";
import { ProfileBilling } from "./billing/ProfileBilling";
import { ProfileEmail } from "./emails/ProfileEmail";
import { ProfileOrganization } from "./organization/ProfileOrganization";
import { ProfileSetup } from "./profile/ProfileSetup";
import { ProfilePurchase } from "./purchase/ProfilePurchase";

type DashboardProfileProps = {};

export const DashboardProfile = ({}: DashboardProfileProps) => {
  const t = useTranslations("Dashboard.Components.Profile");
  const { saasSettings } = useSaasSettingsStore();

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <SectionWrapper
          id="Profile"
          sectionName={t("Profile.title")}
          // mainSectionName={t("Account.title")}
          icon={<CircleUser className="icon" />}>
          <ProfileSetup />
        </SectionWrapper>
        <SectionWrapper
          id="Account"
          sectionName={t("Account.title")}
          // mainSectionName={t("Account.title")}
          icon={<UserRoundCog className="icon" />}>
          <ProfileAccount />
        </SectionWrapper>
      </div>

      {saasSettings.saasType !== "PAY_ONCE" && (
        <>
          <SectionWrapper
            id="Organization"
            sectionName={t("Organization.title")}
            // mainSectionName={t("Account.title")}
            icon={<Building2 className="icon" />}>
            <ProfileOrganization />
          </SectionWrapper>
          <SectionWrapper
            id="Billing"
            sectionName={t("Billing.title")}
            // mainSectionName="Billing"
            icon={<CreditCard className="icon" />}>
            <ProfileBilling />
          </SectionWrapper>
        </>
      )}
      <SectionWrapper
        id="Purchase"
        sectionName={t("Purchases.title")}
        // mainSectionName="Purchase"
        icon={<CreditCard className="icon" />}>
        <ProfilePurchase />
      </SectionWrapper>
      <SectionWrapper
        id="Emails"
        sectionName={t("Emails.title")}
        // mainSectionName="Emails"
        icon={<Mail className="icon" />}>
        <ProfileEmail />
      </SectionWrapper>
    </>
  );
};
