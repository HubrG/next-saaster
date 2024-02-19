"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Loader } from "@/src/components/ui/loader";
import { Separator } from "@/src/components/ui/separator";
import { HandMetal } from "lucide-react";
import { signIn } from "next-auth/react";
import React from "react";

export const FirstConnexion = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onGithubSignIn = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: `/en/admin` });
  };

  return (
    <>
      <div className="first-connection">
        <div className="flex mx-auto  h-[100vh]  w-screen justify-center items-center">
          <Card className="my-card max-w-2xl mx-5 flex flex-col text-center gap-6 justify-center">
            <h1 className="flex flex-col gap-2 justify-center items-center text-center">
              <HandMetal size={30} />
              First connexion
            </h1>
            <p className="text-center">
              Log in with Github to create the admin account and start
              configuring the <strong>SaaSter</strong>
            </p>
            <Goodline />
            <Button
              onClick={onGithubSignIn}
              className="w-full mt-1 flex justify-center items-center gap-x-2  hover:text-slate-100 text-slate-200 border-slate-950"
              type="button"
              disabled={isLoading}>
              {isLoading ? (
                <Loader className="mr-2" />
              ) : (
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
              )}
              Connect to GitHub
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};
