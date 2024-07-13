import { SubSectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SubSectionWrapper";
import SwitchActiveDarkMode from "./switches/SwitchActiveDarkMode";
import SwitchNotifications from "./switches/SwitchActiveNotification";
import SwitchCtaOnNavbar from "./switches/SwitchCtaOnNavbar";
import SwitchDefaultDarkMode from "./switches/SwitchDefaultDarkMode";
import SwitchDefaultLightMode from "./switches/SwitchDefaultLightMode";
import SwitchEnableNewsletter from "./switches/SwitchEnableNewsletter";
import SwitchTopLoader from "./switches/SwitchTopLoader";

export const Layout = () => {
  return (
    <>
      <SubSectionWrapper
        sectionName="Dark/Light Mode"
        id="dark-light-mode"
        info="Set the default dark or light mode for your application.">
        <div className="grid grid-cols-2 gap-5 w-full">
          <SwitchDefaultDarkMode />
          <SwitchDefaultLightMode />
          <SwitchActiveDarkMode />
        </div>
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="UI Settings"
        id="ui-settings"
        info="Configure various user interface elements.">
        <div className="grid grid-cols-2 gap-5 w-full">
          <SwitchTopLoader />
          <SwitchCtaOnNavbar />
          <SwitchNotifications />
        </div>
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="Newsletter"
        id="newsletter-settings"
        info="Enable or disable the newsletter feature.">
        <div className="grid grid-cols-2 gap-5 w-full">
          <SwitchEnableNewsletter />
        </div>
      </SubSectionWrapper>
    </>
  );
};
