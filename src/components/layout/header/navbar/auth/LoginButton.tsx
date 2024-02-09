"use client";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { useTransition } from "react";
import { User } from "lucide-react";
import Router from "next/navigation";

export const LoginButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = Router.useRouter();

  const handleLogin = async () => {
    return router.push(`/login`);
  };

  return (
    <Button variant="ghost" onClick={(e) => startTransition(handleLogin)}>
      {isPending ? (
        <Loader className="mr-2 h-4 w-4" />
      ) : (
        <User className="mr-2 h-4 w-4" />
      )}
      <span className="lg:block md:hidden block">Login</span>
    </Button>
  );
};
