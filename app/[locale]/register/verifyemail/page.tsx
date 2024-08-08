"use client";
import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { SimpleLoader } from "@/src/components/ui/@blitzinit/loader";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Card } from "@/src/components/ui/@shadcn/card";
import { Link, useRouter } from "@/src/lib/intl/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const t = useTranslations("Register.VerifyEmailPage");
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false); // Nouvel état pour éviter les doubles appels

  const handleVerification = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token && !isVerifying) {
      // Vérifier si un token existe et que la vérification n'est pas en cours
      setToken(token);
      setIsVerifying(true); // Marquer la vérification comme en cours
      verifyUserEmail(token);
    }
  };

  const verifyUserEmail = async (token: string) => {
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
    } finally {
      setIsVerifying(false); // Marquer la vérification comme terminée
    }
  };

  useEffect(() => {
    handleVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (verified) {
      toaster({ type: "success", description: t("success") });
      return router.push("/login");
    }
  }, [verified]);

  useEffect(() => {
    if (error.length > 0 && !verified) {
      toaster({ type: "error", description: error });
    }
  }, [error]);

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
              {!verified && error.length > 0 && error && (
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
