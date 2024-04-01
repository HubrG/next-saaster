"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Card } from "@/src/components/ui/card";
import { Link } from "@/src/lib/intl/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";
import Credentials from "./SignCredentials";
import { SignWithGithub } from "./SignWithGithub";
import { SignWithGoogle } from "./SignWithGoogle";
type Props = {
  withGithub?: boolean;
  error?: boolean;
};
export const Index = ({ withGithub, error }: Props) => {
  const errorDisplayed = useRef(false);

  const displayError = useCallback(() => {
    if (!errorDisplayed.current) {
      toaster({
        type: "error",
        description: "Bad credentials",
      });
      errorDisplayed.current = true; // Marquer l'erreur comme affichée
    }
  }, []);

  useEffect(() => {
    if (error && !errorDisplayed.current) {
      displayError();
    }
    // Si vous devez réinitialiser cette logique quand l'erreur change, vous pourriez ajouter:
    // return () => { errorDisplayed.current = false; };
  }, [error, displayError]);


  return (
    <Card className="my-card">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-4xl">Log in to your account</h1>
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
          No account ? <Link href="/register">Register</Link>
        </p>
      </div>
    </Card>
  );
};
