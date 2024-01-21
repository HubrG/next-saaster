"use client";
import { Link } from "@/src/lib/intl/navigation";
import { LoginButton } from "./auth/LoginButton";
import { UserProfile } from "./auth/UserProfile";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import TryUsButton from "./TryUsButton";
//
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import MainMenu from "./MainMenu";
import { appSettings } from "@prisma/client";
//
interface Link {
  url: string;
  name: string;
}

interface Props {
  links: Link[];
  locale: string;
  settings: appSettings;
}

export default function BurgerMenu(props: Props) {
  const user = useSession().data?.user;
  const { links } = props;

  return (
    <>
      <Sheet>
        <SheetTrigger className="inline-flex lg:hidden">
          <Menu className="icon" />
        </SheetTrigger>
        <SheetContent className="h-full">
          <SheetHeader>
            <SheetDescription>
              <ul className="flex flex-col gap-5">
                <SheetClose asChild>
                  <MainMenu links={links} locale={props.locale} />
                </SheetClose>
                <li className="md:hidden flex w-full justify-center ">
                  {props.settings.activeCtaOnNavbar &&
                    (user ? (
                      <SheetClose asChild>
                        <TryUsButton className="sm:hidden block" />
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <TryUsButton className="sm:hidden block" />
                      </SheetClose>
                    ))}
                </li>
                <li className="sm:hidden flex w-full justify-center">
                  <SheetClose asChild>
                    {user ? (
                      <UserProfile className="w-full" />
                    ) : (
                      <LoginButton />
                    )}
                  </SheetClose>
                </li>
              </ul>
            </SheetDescription>
          </SheetHeader>
          {props.settings.activeDarkMode && (
            <SheetFooter>
              <SheetClose asChild>
                <ThemeToggle className="sm:hidden" />
              </SheetClose>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
