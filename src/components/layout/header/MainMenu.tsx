"use client";

import { Link } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
interface Link {
  url: string;
  name: string;
}

interface MenuProps {
  links: Link[];
}

export default function MainMenu(props:MenuProps) {
  const pathname = usePathname();
  const { links } = props;
  const t = useTranslations("Components");
 
  return (
    <div
      className="main-menu"
      id="navbar-sticky">
      <ul className="main-menu">
        {links.map((link, index) => (
          <li key={link.url}>
            <Link
              href={link.url}
              className={`${
                pathname === link.url
                  ? "special-uderline-active"
                  : "special-uderline"
              } nunderline`}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
