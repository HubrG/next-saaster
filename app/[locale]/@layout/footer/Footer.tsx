"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { NewsletterForm } from "@/src/components/ui/@blitzinit/newsletter-form/newsletter-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/@shadcn/avatar";
import links from "@/src/jsons/main-menu.json";
import { Link } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { upperCase } from "lodash";
import { useTranslations } from "next-intl";
import MainMenu from "../header/navbar/MainMenu";

export default function Footer() {
  const t = useTranslations();
  const { appSettings: settings } = useAppSettingsStore();
  return (
    <>
      <Goodline className="mt-32" />
      <footer>
        <nav className="flex flex-col h-full items-center gap-2 justify-start">
          <h2 className="!md:text-xl !text-4xl">{settings?.name}</h2>
          <Link href="/">
            <Avatar className="!no-underline h-14 w-14 mx-auto ">
              {settings?.image && (
                <AvatarImage
                  src={settings.image}
                  className={cn(` rounded cursor-pointer`)}
                  alt={settings.name ?? "User avatar"}
                />
              )}
              <AvatarFallback style={{ textDecoration: "transparent" }}>
                <span className="!no-underline text-4xl">
                  {upperCase(
                    settings?.name
                      ?.toString()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </span>
              </AvatarFallback>
            </Avatar>
          </Link>
        </nav>
        <Goodline className="md:hidden block" />
        <nav className="flex flex-col max-md:-mt-10">
          <h2>{t("Footer.Navigation.title")}</h2>
          <ul>
            <MainMenu
              links={links}
              className="list-none nunderline text-center"
            />
          </ul>
          <Link href="/blog">{t("Footer.Navigation.blog")}</Link>
          <Link href="/faq">{t("Footer.Navigation.faq")}</Link>
        </nav>
        <nav className="flex flex-col">
          <h2>{t("Footer.Legal.title")}</h2>
          <Link href="/terms">{t("Footer.Legal.terms")}</Link>
          <Link href="/privacy">{t("Footer.Legal.privacy")}</Link>
        </nav>
        {settings?.enableNewsletter && (
          <nav className="flex flex-col md:w-2/3 w-full">
            <h2 className="text-center">{t("Footer.Legal.newsletter")}</h2>
            <NewsletterForm className="-mt-10" />
          </nav>
        )}
      </footer>
    </>
  );
}
