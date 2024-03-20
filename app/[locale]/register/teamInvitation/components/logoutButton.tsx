"use client";
import { Button } from "@/src/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";
type LogoutInviteButtonProps = {};

export const LogoutInviteButton = ({}: LogoutInviteButtonProps) => {
  return (
    <>
      <p>
        You are logged with the right email address, but you need to log out to
        accept the invitation.
      </p>
      <Button className="w-full mt-5" onClick={() => signOut()}>Sign out</Button>
    </>
  );
};
