"use client";
import { Link } from "@/src/lib/intl/navigation";
import { usePathname } from "next/navigation";
interface Link {
  url: string;
  name: string;
}

interface MenuProps {
  links: Link[];
  locale: string;
}

export default function MainMenu(props: MenuProps) {
  const pathname = usePathname();
  const { links } = props;
  return (
    <>
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={`/${link.url}`}
            onClick={() => { document.getElementById("close-sheet")?.click(); }}
            className={`${
              pathname === `/${props.locale}/${link.url}`
                ? "special-uderline-active"
                : "special-uderline"
            } nunderline`}>
            {link.name}
          </Link>
        </li>
      ))}
    </>
  );
}
