"use client";

import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { CircleUser, CreditCard, Mail, UserRoundCog } from "lucide-react";
import { ProfileAccount } from "./account/ProfileAccount";
import { ProfileBilling } from "./billing/ProfileBilling";
import { ProfileEmail } from "./emails/ProfileEmail";
import { ProfileSetup } from "./profile/ProfileSetup";

type DashboardProfileProps = {
}

export const DashboardProfile = ({}: DashboardProfileProps) => {
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
      <SectionWrapper
        id="Billing"
        sectionName="Billing"
        mainSectionName="Billing"
        icon={<CreditCard className="icon" />}>
        <ProfileBilling />
      </SectionWrapper>
      <SectionWrapper
        id="Emails"
        sectionName="Emails"
        mainSectionName="Emails"
        icon={<Mail className="icon" />}>
        <ProfileEmail />
      </SectionWrapper>
    </>
  );
}
