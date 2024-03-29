"use client";
import { useIsClient } from "@/src/hooks/useIsClient";
import { appSettings } from "@prisma/client";
import { ShoppingBagIcon } from "lucide-react";
import { Session } from "next-auth";
import { Button } from "../../../../src/components/ui/button";
import BurgerMenu from "./navbar/BurgerMenu";
import Logo from "./navbar/Logo";
import MainMenu from "./navbar/MainMenu";
import { ThemeToggle } from "./navbar/ThemeToggle";
import TryUsButton from "./navbar/TryUsButton";
import { LoginButton } from "./navbar/auth/LoginButton";
import { UserProfile } from "./navbar/auth/UserProfile";
type NavbarProps = {
  session: Session | undefined;
  settings: appSettings;
};
export const Navbar = ({ session, settings }: NavbarProps) => {
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
  /* NOTE --> Change the links of main menu here.
     NOTE --> Create your new pages on the app router for each new link, except for "Pricing" and "Contact" which are special pages
     NOTE --> example : {url: "your-new-page", name: t(`Features.Layout.Header.Navbar.MainMenu.links.your-new-page`),}
     NOTE -->  You may change the name of the links in the translation file (messages/en.json), dont forget to add the translation in the other languages */
  const links = [
    {
      url: "how-it-works", // customize it
      name: "How it works ?",
    },
    {
      url: "pricing", // special page (don't delete it, it's important for a SaaS app)
      name: "Pricing",
    },
    {
      url: "contact", // special page
      name: "Contact",
    },
  ];
  //
  return (
    <header className="z-20  ">
      <nav id="navbar">
        <div>
          <Logo settings={settings} />
          <div className="flex gap-x-2 lg:order-2 items-center lg:text-base">
            <div className="flex items-center gap-x-2 ">
              <TryUsButton
                value="Buy now !"
                icon={<ShoppingBagIcon className="icon" />}
              />
              <Button className="hidden"></Button>
              <div className="sm:block hidden">
                  {session ? <UserProfile /> : <LoginButton />}
              </div>
              <ThemeToggle className="sm:block hidden" classNameMoon="-mt-6" />
            </div>
            <BurgerMenu links={links} settings={settings} />
          </div>
          <div className="main-menu" id="navbar-sticky">
            <ul className="main-menu">
              <MainMenu links={links} />
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
