"use client";
import { useIsClient } from "@/src/hooks/useIsClient";
import links from "@/src/jsons/main-menu.json";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../../../../src/components/ui/button";
import BurgerMenu from "./navbar/BurgerMenu";
import ChangeLanguage from "./navbar/ChangeLanguage";
import Logo from "./navbar/Logo";
import MainMenu from "./navbar/MainMenu";
import Notifications from "./navbar/Notifications";
import { ThemeToggle } from "./navbar/ThemeToggle";
import TryUsButton from "./navbar/TryUsButton";
import { LoginButton } from "./navbar/auth/LoginButton";
import { UserProfile } from "./navbar/auth/UserProfile";
type NavbarProps = {
  settings: appSettings;
};

export const Navbar = ({ settings }: NavbarProps) => {
  const { data: session, isLoading } = useSessionQuery();
  const { appSettings } = useAppSettingsStore();

  const t = useTranslations("Layout.Header.Navbar");
  const isClient = useIsClient();

  if (!isClient) {
    <header className="z-20  ">
      <nav id="navbar">
        <div>
          <Logo settings={settings} />
        </div>
      </nav>
    </header>;
  }
  /* NOTE --> Change the links of main menu in the file "main-menu.json" in the folder "jsons"
     NOTE --> Create your new pages on the app router for each new link, except for "Pricing" and "Contact" which are special pages
     NOTE --> example : {url: "your-new-page", name: t(`MainMenu`),}
     NOTE -->  You may change the name of the links in the translation file (messages/en.json), dont forget to add the translation in the other languages */
  return (
    <header className="z-20  ">
      <nav id="navbar">
        <div>
          <div className="flex items-center justify-between !ml-5`">
            <Logo settings={settings} />
            <div className="main-menu ml-10" id="navbar-sticky">
              <ul className="main-menu">
                <MainMenu links={links} />
              </ul>
            </div>
          </div>
          <div className="flex gap-x-2 lg:order-2 items-center lg:text-base">
            <div className="flex items-center gap-x-2 ">
              <TryUsButton
                value={t("buy-now")}
                icon={<ShoppingBagIcon className="icon mx-0 mr-2" />}
              />
              <Button className="hidden"></Button>
              <div className="sm:flex hidden  flex-row items-center">
                {session?.user.id || isLoading ? (
                  <>
                    <Notifications active={!!appSettings.activeNotification} />
                    <UserProfile
                      email={session?.user.email ?? ""}
                      isLoading={isLoading}
                    />
                    <ChangeLanguage />
                  </>
                ) : (
                  <>
                    <LoginButton />
                    <ChangeLanguage />
                  </>
                )}
              </div>
              <ThemeToggle className="sm:block hidden" classNameMoon="-mt-6" />
            </div>
            <BurgerMenu links={links} settings={settings} />
          </div>
        </div>
      </nav>
      {/* <Goodline className="!-mt-0 !opacity-20" /> */}
    </header>
  );
};
