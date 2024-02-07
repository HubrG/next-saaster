import ToggleActiveDarkMode from "@/src/components/features/pages/admin/setup/layout-settings/ToggleActiveDarkMode";
import ToggleCtaOnNavbar from "@/src/components/features/pages/admin/setup/layout-settings/ToggleCtaOnNavbar";
import ToggleDefaultDarkMode from "@/src/components/features/pages/admin/setup/layout-settings/ToggleDefaultDarkMode";
import ToggleTopLoader from "@/src/components/features/pages/admin/setup/layout-settings/ToggleTopLoader";
import { SetupDesign } from "@/src/components/features/pages/admin/setup/design-settings/SetupDesign";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { InfoApp } from "@/src/components/features/pages/admin/setup/info-settings/InfoApp";
import { Info, LayoutDashboard, Palette } from "lucide-react";


export const AdminSetup = () => {
  return (
    <>
      <SectionWrapper
        id="InfosApp"
        sectionName="Info"
        icon={<Info className="icon" />}>
        <InfoApp />
      </SectionWrapper>
      <SectionWrapper
        icon={<Palette className="icon" />}
        id="Design"
        sectionName="Design">
        <SetupDesign />
      </SectionWrapper>
      <SectionWrapper
        icon={<LayoutDashboard className="icon" />}
        id="Layout"
        sectionName="Layout"
        className="multiple-components ">
        <ToggleDefaultDarkMode />
        <ToggleActiveDarkMode />
        <ToggleTopLoader />
        <ToggleCtaOnNavbar />
      </SectionWrapper>
    </>
  );
};
