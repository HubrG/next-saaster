"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Card } from "@/src/components/ui/card";
import { Link, useRouter } from "@/src/lib/intl/navigation";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef } from "react";
import Credentials from "./SignCredentials";
import { SignWithGithub } from "./SignWithGithub";
import { SignWithGoogle } from "./SignWithGoogle";

type Props = {
  withGithub?: boolean;
  error?: boolean;
};
export function Index({ withGithub, error }: Props): JSX.Element {
  const t = useTranslations("Login");
  const router = useRouter();
  const errorDisplayed = useRef(false);
  const { data: session, isLoading, isError } = useSessionQuery();

  const displayError = useCallback(() => {
    if (!errorDisplayed.current) {
      toaster({
        type: "error",
        description: t("toasters.bad-credentials"),
      });
      errorDisplayed.current = true;
    }
  }, [t]);

  useEffect(() => {
    if (error && !errorDisplayed.current) {
      displayError();
    }
  }, [error, displayError]);

  if (isLoading)
    return (
      <Card className="my-card pointer-events-none !opacity-50" aria-disabled>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-4xl">{t("title")}</h1>
          <div className="mt-7 flex flex-col gap-2">
            <Goodline />
            {withGithub && <SignWithGithub />}
            <SignWithGoogle />
          </div>
          <Goodline />
          {/* <MagicLink /> */}
          <Suspense fallback={<SkeletonLoader type="page" />}>
            <Credentials />
          </Suspense>
          <Goodline className="!my-4 !mb-10" />
          <p>
            {t("button.no-account")}{" "}
            <Link href="/register">{t("button.register")}</Link>
          </p>
        </div>
      </Card>
    );
  if (session) {
    router.push("/");
    return (
      <Card className="my-card">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <SkeletonLoader type="card" />
        </div>
      </Card>
    );
  }
  if (isError) {
    toaster({
      type: "error",
      description: "An error occured",
    });
    router.push("/");
  }

  return (
    <Card className="my-card">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-4xl">{t("title")}</h1>
        <div className="mt-7 flex flex-col gap-2">
          <Goodline />
          {withGithub && <SignWithGithub />}
          <SignWithGoogle />
        </div>
        <Goodline />
        {/* <MagicLink /> */}
        <Suspense fallback={<SkeletonLoader type="page" />}>
          <Credentials />
        </Suspense>
        <Goodline className="!my-4 !mb-10" />
        <p>
          {t("button.no-account")}{" "}
          <Link href="/register">{t("button.register")}</Link>
        </p>
      </div>
    </Card>
  );
}
