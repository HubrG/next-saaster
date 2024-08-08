"use client";
import { Button } from "@/src/components/ui/@shadcn/button";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
type LogoutInviteButtonProps = {};

export const LogoutInviteButton = ({}: LogoutInviteButtonProps) => {
  const t = useTranslations("Register.TeamInvitationPage");
  return (
    <>
      <p>{t("logged-in-with-right-email")}</p>
      <Button className="w-full mt-5" onClick={() => signOut()}>
        {t("Register.TeamInvitationPage.logout")}
      </Button>
    </>
  );
};
