import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { Link } from "@/src/lib/intl/navigation";
import { Button } from "../../ui/button";
import { Box } from "lucide-react";
import { UserProfile } from "./auth/UserProfile";
import { LoginButton } from "./auth/LoginButton";
import { ThemeToggle } from "./ThemeToggle";
import BurgerMenu from "./BurgerMenu";
import MainMenu from "./MainMenu";
import { getTranslations } from "next-intl/server";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Components");

   


  const prefix = "/";
  /* NOTE : Change the links of main menu here.
   NOTE : Create your new pages on the app router for each new link, except for "Pricing" and "Contact" which are special pages
  example : {url: prefix + "your-new-page", name: t(`Features.Layout.Header.MainMenu.links.your-new-page`),}
  NOTE : You may change the name of the links in the translation file (messages/en.json), dont forget to add the translation in the other languages
  */
  const links = [
    {
      url: prefix + "how-it-works",
      name: t(`Features.Layout.Header.MainMenu.links.how-it-works`),
    },
    {
      url: prefix + "pricing",
      name: t(`Features.Layout.Header.MainMenu.links.pricing`),
    },
    {
      url: prefix + "contact",
      name: t(`Features.Layout.Header.MainMenu.links.contact`),
    },
  ];
  //
  return (
    <header className=" z-20 w-full">
      <nav>
        <div>
          <Link href="/" className="logo mr-2">
            <span className="sm:text-xs flex flex-row">
              <span className="mr-1">
                {/* <FontAwesomeIcon
                className="mr-1"
                icon={faBrainCircuit}
              /> */}
              </span>
              <span>Fastuff</span>
              <sup className="mt-1 ml-2 text-sm text-secondary/60">ai</sup>
            </span>
          </Link>
          <div className="flex gap-x-2 lg:order-2 items-center lg:text-base">
            <div className="flex items-center gap-x-2">
              {/* {user ? (
              <CreateNewPdfButton className="sm:block hidden" user={user} />
            ) : ( */}
              {/* FIX - Changer le link vers la page des produits (et d'inscription) */}
              <Link
                href="/raconter-ses-memoires/tarifs"
                className="sm:block hidden">
                <Button
                  id="try-us-for-free-button"
                  className="px-4 font-bold text-base"
                  variant="ghost"
                  size={"lg"}>
                  <Box className="icon" />
                  {t("Features.Layout.Header.Navbar.buttons.try")}
                </Button>
              </Link>
              {/* )} */}
              <div className="sm:block hidden">
                {session ? <UserProfile /> : <LoginButton />}
              </div>
              <ThemeToggle />
            </div>{" "}
            <BurgerMenu links={links} />
          </div>
          <MainMenu links={links} />
        </div>
      </nav>
    </header>
  );
};
