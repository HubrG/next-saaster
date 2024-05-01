"use client";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Card } from "@/src/components/ui/card";
import { Link, redirect } from "@/src/lib/intl/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const t = useTranslations("Register.VerifyEmailPage");
  const locale = useLocale();
  const { data: session } = useSession();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const verifyUserEmail = async () => {
    try {
      const res = await fetch("/api/register/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, locale }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setVerified(true);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (verified) {
      toaster({ type: "success", description: t("success") });
      redirect("/login");
    }
  }, [verified, t]);
  useEffect(() => {
    if (error.length > 0) {
      toaster({ type: "error", description: error });
    }
  }, [error]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className=" items-center justify-center ">
        <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
          <Card className=" my-card">
            <h1 className="text-2xl">{t("title")}</h1>
            <p className="text-center py-5 flex flex-col justify-center">
              {!verified && !error && <SimpleLoader className="self-center" />}
              {verified && t("success")}
              {error.length > 0 && error && (
                <>
                  {error}
                  {!session?.user.email && (
                    <>
                      <span>
                        <br />
                        <Link href="/login">
                          {t("login-to-you-account")}
                        </Link>{" "}
                        {t("request-new-validation")}
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
