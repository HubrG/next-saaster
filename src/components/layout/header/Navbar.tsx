import { getAppSettings } from "@/app/[locale]/server.actions";
import { authOptions } from "@/src/lib/next-auth/auth";
import { appSettings } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "../../ui/button";
import BurgerMenu from "./navbar/BurgerMenu";
import Logo from "./navbar/Logo";
import MainMenu from "./navbar/MainMenu";
import { ThemeToggle } from "./navbar/ThemeToggle";
import TryUsButton from "./navbar/TryUsButton";
import { LoginButton } from "./navbar/auth/LoginButton";
import { UserProfile } from "./navbar/auth/UserProfile";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Components");
  const locale = await getLocale();
  const settings = (await getAppSettings()) as appSettings;

  /* NOTE --> Change the links of main menu here.
     NOTE --> Create your new pages on the app router for each new link, except for "Pricing" and "Contact" which are special pages
     NOTE --> example : {url: "your-new-page", name: t(`Features.Layout.Header.Navbar.MainMenu.links.your-new-page`),}
     NOTE -->  You may change the name of the links in the translation file (messages/en.json), dont forget to add the translation in the other languages */
  const links = [
    {
      url: "how-it-works", // customize it
      name: t(`Features.Layout.Header.Navbar.MainMenu.links.how-it-works`),
    },
    {
      url: "pricing", // special page (don't delete it)
      name: t(`Features.Layout.Header.Navbar.MainMenu.links.pricing`),
    },
    {
      url: "contact", // special page
      name: t(`Features.Layout.Header.Navbar.MainMenu.links.contact`),
    },
  ];
  //
  return (
    <header className=" z-20 w-full">
      <nav id="navbar">
        <div>
          <Logo settings={settings} />
          <div className="flex gap-x-2 lg:order-2 items-center lg:text-base">
            <div className="flex items-center gap-x-2">
              {settings.activeCtaOnNavbar &&
                (session ? <TryUsButton /> : <TryUsButton />)}
              <Button className="hidden"></Button>
              <div className="sm:block hidden">
                {session ? <UserProfile /> : <LoginButton />}
              </div>
              {settings.activeDarkMode && (
                <ThemeToggle
                  className="sm:block hidden"
                  classNameMoon="-mt-6"
                />
              )}
            </div>
            <BurgerMenu links={links} locale={locale} settings={settings} />
          </div>
          <div className="main-menu" id="navbar-sticky">
            <ul className="main-menu">
              <MainMenu links={links} locale={locale} />
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
