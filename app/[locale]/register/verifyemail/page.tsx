"use client";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Card } from "@/src/components/ui/card";
import { Link } from "@/src/lib/intl/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
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
        body: JSON.stringify({ token }),
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
      toaster({ type: "success", description: "Email Verified" });
    }
  }, [verified]);
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
    <section className="flex h-screen justify-center items-center">
      <Card className="max-w-xl mx-auto my-card">
        <h1>Email verification</h1>
        <p className="text-xl py-5 flex flex-col justify-center">
          {!verified && !error && <SimpleLoader className="self-center" />}
          {verified && "Your email has been verified"}
          {error.length > 0 && error && (
            <>
              {error}
              {!session?.user.email && (
                <>
                  <span>
                    <br />
                    <br />
                    <Link href="/login">Log in to your account</Link> and
                    request a new validation link if you still haven&apos;t
                    validated it.
                  </span>
                </>
              )}
            </>
          )}
        </p>
      </Card>
    </section>
  );
}
