"use client";

import { InfoApp } from "@/app/[locale]/admin/components/setup/info-settings/InfoApp";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { Info } from "lucide-react";
import { ProfileSetup } from "./profile/ProfileSetup";

type DashboardProfileProps = {
}

export const DashboardProfile = ({}: DashboardProfileProps) => {
  return (
    <SectionWrapper
      id="Profile"
      sectionName="Profile"
      mainSectionName="Profile"
      icon={<Info className="icon" />}>
      <ProfileSetup />
    </SectionWrapper>
  );
}
