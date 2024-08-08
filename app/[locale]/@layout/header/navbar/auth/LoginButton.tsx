"use client";
import { SimpleLoader } from "@/src/components/ui/@blitzinit/loader";
import { Button } from "@/src/components/ui/@shadcn/button";
import { useRouter } from "@/src/lib/intl/navigation";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
export const LoginButton = () => {
  const t = useTranslations("Layout.Header.Navbar.UserProfile");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async () => {
    return router.push(`/login`);
  };

  return (
    <Button variant="ghost" className="flex-row-center gap-2" onClick={(e) => startTransition(handleLogin)}>
      {isPending ? (
        <SimpleLoader className="" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      <span className="lg:block md:hidden block font-bold">{t("login")}</span>
    </Button>
  );
};
