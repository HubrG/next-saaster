"use client";
import {
  isUserExists
} from "@/app/[locale]/dashboard/queries/organization.action";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Card } from "@/src/components/ui/card";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { acceptInvitationToOrganization, removePendingUser } from "@/src/helpers/db/organization.action";
import { iOrganization } from "@/src/types/iOrganization";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TeamInvitationProps = {
  organization: iOrganization | null;
  email: string;
};

export const TeamInvitationIndex = ({
  organization,
  email,
}: TeamInvitationProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  if (!organization) {
    toaster({ type: "error", description: "Organization not found" });
    return (
      <Card>
        <h1 className="text-xl mb-5">Organization not found</h1>
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
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    if (accept.serverError) {
      toaster({ type: "error", description: accept.serverError });
      setIsLoading(false);
      return;
    } else {
      // We verifiy if the user has an account
      const user = await isUserExists(email);
      if (!user) {
        toaster({ type: "success", description: "Invitation accepted, please create an account and login with it to finalize.", duration:5000 });
        router.push(`/register`);
        setIsLoading(false);
        return;
      } else {
        toaster({ type: "success", description: "Invitation accepted, please login to your account to finalize.", duration:5000 });
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
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    if (decline.serverError) {
      toaster({ type: "error", description: decline.serverError });
      setIsLoading(false);
    }
    else {
      toaster({ type: "success", description: "Invitation declined" });
      setTimeout(() => {
        router.push("/");
        setIsLoading(false);
      }, 1000);
    }
  };
  return (
    <Card>
      <h1 className="text-xl mb-5">Join the {organizationName}&apos;s team</h1>
      {organization.organizationInvitations?.find(
        (invitation) => invitation.email === email && invitation.isAccepted
      ) ? (
        <p className="text-center">You have already accepted the invitation.</p>
      ) : (
        <>
          <p>
            You have been invited to join {organizationName} team.
            <br />
            <strong>Do you accept this invitation ?</strong>
          </p>
          <Goodline />
          <div className="flex flex-row w-full items-center gap-x-5 justify-between mt-10">
            <ButtonWithLoader
              onClick={() => handleAccept()}
              disabled={isLoading}
              className="w-full"
              loading={isLoading}>
              Accept
            </ButtonWithLoader>
            <ButtonWithLoader
              onClick={() => handleDecline()}
              className="w-full"
              disabled={isLoading}
              variant={"ghostDestructive"}
              loading={isLoading}>
              Decline
            </ButtonWithLoader>
          </div>
        </>
      )}
    </Card>
  );
};
