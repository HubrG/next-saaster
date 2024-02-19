import SwitchActiveDarkMode from "./switches/SwitchActiveDarkMode";
import SwitchCtaOnNavbar from "./switches/SwitchCtaOnNavbar";
import SwitchDefaultDarkMode from "./switches/SwitchDefaultDarkMode";
import SwitchTopLoader from "./switches/SwitchTopLoader";

export const Layout = () => {
  return (
    <>
      <SwitchDefaultDarkMode />
      <SwitchActiveDarkMode />
      <SwitchTopLoader />
      <SwitchCtaOnNavbar />
    </>
  );
};
