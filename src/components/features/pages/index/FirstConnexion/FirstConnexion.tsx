"use client";
import { Card } from "@/src/components/ui/card";
import React, { ReactNode } from "react";
import {
  useTranslations,
} from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { HandMetal } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export const FirstConnexion = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const t = useTranslations();
  let locale: string | undefined | null = "en";
  if (typeof window !== "undefined") {
    locale = document.querySelector("html")?.getAttribute("lang");
  }
  const onGithubSignIn = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: `/${locale}/admin` });
    setIsLoading(false);
  };
  return (
    <>
      <Card className="w-1/2 flex flex-col text-center gap-2">
        <h1 className="flex flex-row gap-2 justify-center items-center text-center">
          {t("Index.title")}
          <HandMetal className="icon" />
        </h1>
        <p>{t.rich("Components.Features.Pages.Index.FirstConnexion.description", {
            strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
          })}</p>
        <Separator decorative={true} />
        <Button
          onClick={onGithubSignIn}
          className="w-full mt-1 flex justify-center items-center gap-x-2"
          type="button"
          disabled={isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          {t("Components.Features.Pages.Index.FirstConnexion.button-github")}{" "}
        </Button>
        <Button onClick={() => signOut()}>Sign out</Button>

      </Card>
    </>
  );
};
