"use client";
import { Button } from "@/src/components/ui/button";
import React, { useState } from "react";
import { Link } from "@/src/lib/intl/navigation";
import { usePathname } from "next/navigation";
import { LoginButton } from './auth/LoginButton';
import { UserProfile } from './auth/UserProfile';
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

interface Link {
  url: string;
  name: string;
}

interface MenuProps {
  links: Link[];
}

export default function BurgerMenu(props: MenuProps) {
  const pathname = usePathname();
  const user = useSession().data?.user;
  const { links } = props;
  const [display, setDisplay] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          display ? setDisplay(false) : setDisplay(true);
        }}
        type="button"
        className="inline-flex lg:hidden">
        <span className="sr-only">Ouvrir le menu principal</span>
        <Menu className="icon" />
      </Button>
      <div className={`lg:block ${display ? "" : "hidden"} burger-menu`}>
        <ul>
          {links.map((link, index) => (
            <li key={"burger"+link.name} className="">
              <Link
                onClick={() => {
                  setDisplay(false);
                }}
                href={link.url}
                className={` ${
                  pathname === link.url ? "burger-active" : "text-app-900"
                } nunderline`}>
                {link.name}
              </Link>
            </li>
          ))}
          <li
            className="sm:hidden flex w-full justify-center "
            onClick={() => {
              setDisplay(false);
            }}>
            {user ? (
              <UserProfile className="w-full" />
            ) : (
              <LoginButton />
            )}
          </li>
          <li
            className="sm:hidden flex w-full justify-center "
            onClick={() => {
              setDisplay(false);
            }}>
            {/* <CreateNewPdfButton className="w-full" user={user} /> */}
          </li>
        </ul>
      </div>
    </>
  );
}
