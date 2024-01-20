import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { UserProfile } from "./navbar/auth/UserProfile";
import { LoginButton } from "./navbar/auth/LoginButton";
import { ThemeToggle } from "./navbar/ThemeToggle";
import BurgerMenu from "./navbar/BurgerMenu";
import MainMenu from "./navbar/MainMenu";
import { getTranslations } from "next-intl/server";
import TryUsButton from "./navbar/TryUsButton";
import Logo from "./navbar/Logo";
import { getLocale } from "next-intl/server";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Components");
  const locale = await getLocale();
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
      <nav>
        <div>
          <Logo />
          <div className="flex gap-x-2 lg:order-2 items-center lg:text-base">
            <div className="flex items-center gap-x-2">
              {session ? (
                // NOTE : Create component to access to the main feature of SaaS et put it here
                <TryUsButton />
              ) : (
                <TryUsButton />
              )}
              <div className="sm:block hidden">
                {session ? <UserProfile /> : <LoginButton />}
              </div>
              <ThemeToggle className="sm:block hidden" classNameMoon="-mt-6" />
            </div>
            <BurgerMenu links={links} locale={locale} />
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
