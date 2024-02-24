"use client";
import { SetupDesign } from "@/app/[locale]/admin/components/setup/design-settings/SetupDesign";
import { InfoApp } from "@/app/[locale]/admin/components/setup/info-settings/InfoApp";
import { Loader } from "@/src/components/ui/loader";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { useIsClient } from "@/src/hooks/useIsClient";
import { Info, LayoutDashboard, Palette } from "lucide-react";
import { Suspense } from "react";
import { Layout } from "./layout-settings/Layout";

export const AdminSetup = () => {
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <>
      <SectionWrapper
        id="InfosApp"
        sectionName="Info"
        mainSectionName="Setup"
        icon={<Info className="icon" />}>
        <Suspense fallback={<Loader noHFull />}>
          <InfoApp />
        </Suspense>
      </SectionWrapper>
      <SectionWrapper
        icon={<Palette className="icon" />}
        id="Design"
        mainSectionName="Setup"
        sectionName="Design">
        <Suspense fallback={<Loader noHFull />}>
          <SetupDesign />
        </Suspense>
      </SectionWrapper>
      <SectionWrapper
        icon={<LayoutDashboard className="icon" />}
        id="Layout"
        sectionName="Layout"
        mainSectionName="Setup"
        className="multiple-components ">
        <Suspense fallback={<Loader noHFull />}>
          <Layout />
        </Suspense>
      </SectionWrapper>
    </>
  );
};
