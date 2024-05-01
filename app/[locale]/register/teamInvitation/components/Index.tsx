"use client";
import { isUserExists } from "@/app/[locale]/dashboard/queries/organization.action";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Card } from "@/src/components/ui/card";
import {
  acceptInvitationToOrganization,
  removePendingUser,
} from "@/src/helpers/db/organization.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useRouter } from "@/src/lib/intl/navigation";
import { iOrganization } from "@/src/types/db/iOrganization";
import { useTranslations } from "next-intl";
import { useState } from "react";

type TeamInvitationProps = {
  organization: iOrganization | null;
  email: string;
};

export const TeamInvitationIndex = ({
  organization,
  email,
}: TeamInvitationProps) => {
  const t = useTranslations("Register.TeamInvitationPage");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  if (!organization) {
    toaster({
      type: "error",
      description: t("Register.TeamInvitationPage.organization-not-found"),
    });
    return (
      <Card>
        <h1 className="text-xl mb-5">
          {t("Register.TeamInvitationPage.organization-not-found")}
        </h1>
      </Card>
    );
  }
  const organizationName =
    organization.name === "" || organization.name === "Organization name"
      ? organization.owner.name
      : organization.name;

  const handleAccept = async () => {
    setIsLoading(true);
    const accept = await acceptInvitationToOrganization({
      organizationId: organization.id,
      email,
      secret: chosenSecret(),
    });
    if (accept.serverError) {
      toaster({ type: "error", description: accept.serverError });
      setIsLoading(false);
      return;
    } else {
      // We verifiy if the user has an account
      const user = await isUserExists(email);
      if (!user) {
        toaster({
          type: "success",
          description: t("Register.TeamInvitationPage.invitation-accepted"),
          duration: 5000,
        });

        router.push(`/register`);
        setIsLoading(false);
        return;
      } else {
        toaster({
          type: "success",
          description: t("Register.TeamInvitationPage.invitation-accepted-2"),
          duration: 5000,
        });
        router.push(`/login`);
        setIsLoading(false);
        return;
      }
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    const decline = await removePendingUser({
      organizationId: organization.id,
      email,
      secret: chosenSecret(),
    });
    if (decline.serverError) {
      toaster({ type: "error", description: decline.serverError });
      setIsLoading(false);
    } else {
      toaster({
        type: "success",
        description: t("Register.TeamInvitationPage.invitation-declined"),
      });
      setTimeout(() => {
        router.push("/");
        setIsLoading(false);
      }, 1000);
    }
  };
  return (
    <Card>
      <h1 className="text-xl mb-5">
        {t("Register.TeamInvitationPage.join", {
          varIntlOrganization: organizationName,
        })}
      </h1>
      {organization.organizationInvitations?.find(
        (invitation) => invitation.email === email && invitation.isAccepted
      ) ? (
        <p className="text-center">
          {t("Register.TeamInvitationPage.already-accept")}
        </p>
      ) : (
        <>
          <p className="text-center">
            <strong>{t("Register.TeamInvitationPage.do-you-accept")}</strong>
          </p>
          <Goodline />
          <div className="flex flex-row w-full items-center gap-x-5 justify-between mt-10">
            <ButtonWithLoader
              onClick={() => handleAccept()}
              disabled={isLoading}
              className="w-full"
              loading={isLoading}>
              {t("Register.TeamInvitationPage.accept")}
            </ButtonWithLoader>
            <ButtonWithLoader
              onClick={() => handleDecline()}
              className="w-full"
              disabled={isLoading}
              variant={"ghostDestructive"}
              loading={isLoading}>
              {t("Register.TeamInvitationPage.decline")}
            </ButtonWithLoader>
          </div>
        </>
      )}
    </Card>
  );
};
