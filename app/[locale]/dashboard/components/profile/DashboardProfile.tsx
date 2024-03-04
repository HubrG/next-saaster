"use client";

import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Building2, CircleUser, CreditCard, Mail, UserRoundCog } from "lucide-react";
import { ProfileAccount } from "./account/ProfileAccount";
import { ProfileBilling } from "./billing/ProfileBilling";
import { ProfileEmail } from "./emails/ProfileEmail";
import { ProfileOrganization } from "./organization/ProfileOrganization";
import { ProfileSetup } from "./profile/ProfileSetup";
import { ProfilePurchase } from "./purchase/ProfilePurchase";

type DashboardProfileProps = {};

export const DashboardProfile = ({}: DashboardProfileProps) => {
  const { saasSettings } = useSaasSettingsStore();

  return (
    <>
      <SectionWrapper
        id="Profile"
        sectionName="Profile"
        mainSectionName="Profile"
        icon={<CircleUser className="icon" />}>
        <ProfileSetup />
      </SectionWrapper>
      <SectionWrapper
        id="Account"
        sectionName="Account"
        mainSectionName="Account"
        icon={<UserRoundCog className="icon" />}>
        <ProfileAccount />
      </SectionWrapper>
      {saasSettings.saasType === "PAY_ONCE" ? (
        <SectionWrapper
          id="Purchase"
          sectionName="Purchase"
          mainSectionName="Purchase"
          icon={<CreditCard className="icon" />}>
          <ProfilePurchase />
        </SectionWrapper>
      ) : (
        <>
          <SectionWrapper
            id="Organization"
            sectionName="Organization"
            mainSectionName="Organization"
            icon={<Building2 className="icon" />}>
            <ProfileOrganization />
          </SectionWrapper>
          <SectionWrapper
            id="Billing"
            sectionName="Billing"
            mainSectionName="Billing"
            icon={<CreditCard className="icon" />}>
            <ProfileBilling />
          </SectionWrapper>
        </>
      )}
      <SectionWrapper
        id="Emails"
        sectionName="Emails"
        mainSectionName="Emails"
        icon={<Mail className="icon" />}>
        <ProfileEmail />
      </SectionWrapper>
    </>
  );
};
