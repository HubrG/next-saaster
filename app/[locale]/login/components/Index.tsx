"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Card } from "@/src/components/ui/card";
import { Link } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef } from "react";
import Credentials from "./SignCredentials";
import { SignWithGithub } from "./SignWithGithub";
import { SignWithGoogle } from "./SignWithGoogle";

type Props = {
  withGithub?: boolean;
  error?: boolean;
};
export const Index = ({ withGithub, error }: Props) => {
  const t = useTranslations("Login");
  const errorDisplayed = useRef(false);

  const displayError = useCallback(() => {
    if (!errorDisplayed.current) {
      toaster({
        type: "error",
        description: t('toasters.bad-credentials'),
      });
      errorDisplayed.current = true; // Marquer l'erreur comme affichée
    }
  }, [t]);

  useEffect(() => {
    if (error && !errorDisplayed.current) {
      displayError();
    }
  }, [error, displayError]);


  return (
    <Card className="my-card">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-4xl">{t('title')}</h1>
        <div className="mt-7 flex flex-col gap-2">
          <Goodline />
          {withGithub && <SignWithGithub />}
          <SignWithGoogle />
        </div>
        <Goodline />
        {/* <MagicLink /> */}
        <Suspense>
          <Credentials />
        </Suspense>
        <p>
          {t('button.no-account')} <Link href="/register">{t('button.register')}</Link>
        </p>
      </div>
    </Card>
  );
};
