"use client";
import { Button } from "@/src/components/ui/button";
import { SimpleLoader } from "@/src/components/ui/loader";
import { useRouter } from "@/src/lib/intl/navigation";
import { LogIn } from "lucide-react";
import { useTransition } from "react";
export const LoginButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async () => {
    return router.push(`/login`);
  };

  return (
    <Button variant="ghost" onClick={(e) => startTransition(handleLogin)}>
      {isPending ? (
        <SimpleLoader className="" />
      ) : (
        <LogIn className="mr-2 h-4 w-4" />
      )}
      <span className="lg:block md:hidden block font-bold">Login</span>
    </Button>
  );
};
