"use client";
import { SetupDesign } from "@/src/components/pages/admin/setup/design-settings/SetupDesign";
import { InfoApp } from "@/src/components/pages/admin/setup/info-settings/InfoApp";
import ToggleActiveDarkMode from "@/src/components/pages/admin/setup/layout-settings/ToggleActiveDarkMode";
import ToggleCtaOnNavbar from "@/src/components/pages/admin/setup/layout-settings/ToggleCtaOnNavbar";
import ToggleDefaultDarkMode from "@/src/components/pages/admin/setup/layout-settings/ToggleDefaultDarkMode";
import ToggleTopLoader from "@/src/components/pages/admin/setup/layout-settings/ToggleTopLoader";
import { Loader } from "@/src/components/ui/loader";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { useIsClient } from "@/src/hooks/useIsClient";
import { Info, LayoutDashboard, Palette } from "lucide-react";
import { Suspense } from "react";

export const AdminSetup = () => {
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <>
      <SectionWrapper
        id="InfosApp"
        sectionName="Info"
        icon={<Info className="icon" />}>
        <Suspense fallback={<Loader noHFull />}>
          <InfoApp />
        </Suspense>
      </SectionWrapper>
      <SectionWrapper
        icon={<Palette className="icon" />}
        id="Design"
        sectionName="Design">
        <Suspense fallback={<Loader noHFull />}>
          <SetupDesign />
        </Suspense>
      </SectionWrapper>
      <SectionWrapper
        icon={<LayoutDashboard className="icon" />}
        id="Layout"
        sectionName="Layout"
        className="multiple-components ">
        <Suspense fallback={<Loader noHFull />}>
          <ToggleDefaultDarkMode />
          <ToggleActiveDarkMode />
          <ToggleTopLoader />
          <ToggleCtaOnNavbar />
        </Suspense>
      </SectionWrapper>
    </>
  );
};
