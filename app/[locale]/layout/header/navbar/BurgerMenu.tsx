"use client";
import { Link } from "@/src/lib/intl/navigation";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import TryUsButton from "./TryUsButton";
import { LoginButton } from "./auth/LoginButton";
import { UserProfile } from "./auth/UserProfile";
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
import { appSettings } from "@prisma/client";
import MainMenu from "./MainMenu";
import { ThemeToggle } from "./ThemeToggle";
//
interface Link {
  url: string;
  name: string;
}

interface Props {
  links: Link[];
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
                  <MainMenu links={links} />
                </SheetClose>
                <li className="md:hidden flex w-full justify-center ">
                  {props.settings.activeCtaOnNavbar &&
                    (user ? (
                      <SheetClose asChild>
                        <TryUsButton className="" />
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <TryUsButton className="hidden" />
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
            <SheetFooter className="absolute bottom-10 w-full">
              <div className="flex w-full justify-center">
                <SheetClose asChild>
                  <ThemeToggle className="sm:hidden mr-10" />
                </SheetClose>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
