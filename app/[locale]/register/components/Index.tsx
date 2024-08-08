"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/@shadcn/card";
import { Link } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { SignWithGoogle } from "../../login/components/SignWithGoogle";
import Credentials from "./SignUpWithCredentials";


export const Index = () => {
  const t = useTranslations("Register");
  return (
    <Card className="my-card">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1>{t("title")}</h1>
        <div className="mt-7 flex flex-col gap-2">
          <Goodline />
          <Suspense>
            <SignWithGoogle />
            <Goodline />
            <Credentials />
          </Suspense>
          <p>
            {t("already-account-sentence")}{" "}
            <Link href="/login">{t("button.login")}</Link>
          </p>
        </div>
      </div>
    </Card>
  );
};
