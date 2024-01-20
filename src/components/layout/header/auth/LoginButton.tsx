"use client";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { useTransition } from "react";
import { User } from "lucide-react";
import { signIn } from "next-auth/react";

export const LoginButton = async () => {
  const [isPending, startTransition] = useTransition();

  const onGithubSignIn = async () => {
    await signIn("github");
  };
  return (
    <Button
      variant="ghost"
      onClick={(e) => startTransition(onGithubSignIn)}>
      {isPending ? (
        <Loader className="mr-2 h-4 w-4" />
      ) : (
        <User className="mr-2 h-4 w-4" />
      )}
      <span className="lg:block md:hidden block">Login</span>
    </Button>
  );
};
