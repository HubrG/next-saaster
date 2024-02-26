"use client";
import { Link } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
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
      {links.map((link, index) => {
        const cleanedUrl = link.url.replace(/^\/[a-z]{2}\//, "");
        return (
          <li key={index}>
            <Link
              href={`/${link.url}`}
              scroll={true}
              onClick={() => {
                document.getElementById("close-sheet")?.click();
              }}
              className={cn(
                { "special-uderline-active": pathname.includes(link.url) },
                { "special-uderline": !pathname.includes(link.url) },
                "nunderline"
              )}>
              {link.name}
            </Link>
          </li>
        );
      })}
    </>
  );
}
