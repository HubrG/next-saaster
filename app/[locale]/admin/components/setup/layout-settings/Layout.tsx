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
      <SwitchDefaultDarkMode />
      <SwitchDefaultLightMode />
      <SwitchActiveDarkMode />
      <SwitchTopLoader />
      <SwitchCtaOnNavbar />
      <SwitchNotifications />
      <SwitchEnableNewsletter />
    </>
  );
};
