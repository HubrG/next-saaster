"use client";
import { Link } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface Link {
  url: string;
  name: string;
}

interface MenuProps {
  links: Link[];
  className?: string;
}

export default function MainMenu(props: MenuProps) {
  const pathname = usePathname();
  const t = useTranslations();

  const { links } = props;
  return (
    <>
      {links.map((link, index) => {
        console.log(`Layout.Header.Navbar.MainMenu.${link.url}`);
        return (
          <li key={index} className={props.className}>
            <Link
              href={`/${link.url}` as any}
              scroll={true}
              onClick={() => {
                document.getElementById("close-sheet")?.click();
              }}
              className={cn(
                {
                  "special-uderline-active":
                    pathname.includes(
                      t(
                        `Layout.Header.Navbar.MainMenu.MainMenuLinks.${link.url}`
                      )
                    ) && !props.className,
                },
                {
                  "special-uderline":
                    !pathname.includes(
                      t(
                        `Layout.Header.Navbar.MainMenu.MainMenuLinks.${link.url}`
                      )
                    ) && !props.className,
                },
                {
                  nunderline: !props.className,
                }
              )}>
              {t(link.name)}
            </Link>
          </li>
        );
      })}
    </>
  );
}
