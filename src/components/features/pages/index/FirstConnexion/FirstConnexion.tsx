"use client";
import { Card } from "@/src/components/ui/card";
import React from "react";
import { useTranslations } from "next-intl";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export const FirstConnexion = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const t = useTranslations("Components");
  let locale:string|undefined|null = "en";
  if (typeof window !== "undefined") {
    locale = document.querySelector("html")?.getAttribute("lang");
  }
  const onGithubSignIn = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: `/${locale}/admin?first=true` });
    setIsLoading(false);
  };
  return (
    <>
      <p className="text-xl">
        {t("Features.Pages.Index.FirstConnexion.description")}
      </p>
      <Card>
        <Button
          variant="ghost"
          onClick={onGithubSignIn}
          className="w-full mt-1"
          type="button"
          disabled={isLoading}>
          {t("Features.Pages.Index.FirstConnexion.button-github")}
        </Button>
      </Card>
    </>
  );
};
