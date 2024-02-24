"use client";
import { Link } from "@/src/lib/intl/navigation";
import { usePathname } from "next/navigation";
interface Link {
  url: string;
  name: string;
}

interface MenuProps {
  links: Link[];
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
            scroll={true}
            onClick={() => {
              document.getElementById("close-sheet")?.click();
            }}
            className={`${
              pathname === `/en/${link.url}`
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
