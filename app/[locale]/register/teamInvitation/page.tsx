"use client";
import { Card } from '@/src/components/ui/card';
import { DivFullScreenGradient } from '@/src/components/ui/layout-elements/gradient-background';
type TeamInvitationProps = {
  organizationName?: string;
  organizationId?: string;
}

export default function TeamInvitation ({
  searchParams,
}: {
  searchParams?: { organizationName:string, organizationId:string };
  }) {
  
  if (!searchParams?.organizationId || !searchParams.organizationName) return null;

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-t" />
      <div className=" items-center justify-center ">
        <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
      {searchParams.organizationId && (
        <Card>
          You have been invited to join {searchParams.organizationName} team.
          Create an account with the email invited
        </Card>
      )}
      </div></div>
    </>
  );
};
