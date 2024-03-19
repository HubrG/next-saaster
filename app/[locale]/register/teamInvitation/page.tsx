import { Card } from "@/src/components/ui/card";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import { getOrganization } from "@/src/helpers/db/organization.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { TeamInvitationIndex } from "./components/Index";

export default async function TeamInvitation({
  searchParams,
}: {
  searchParams?: { organizationId: string; email: string };
}) {
  const session = await getServerSession(authOptions);

  let notFound = false;
  const organization = await getOrganization({
    id: searchParams?.organizationId ?? "",
    secret: chosenSecret(),
  });

  if (organization.serverError) {
    notFound = true;
  }
  if (
    !searchParams ||
    !searchParams.organizationId ||
    !organization.data?.success?.organizationInvitations?.find(
      (invitation) => invitation.email === searchParams.email
    )
  ) {
    notFound = true;
  }

  if (notFound) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-t" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
              <h1 className="text-xl mb-5">Organization not found</h1>
            </Card>
          </div>
        </div>
      </>
    );
  }
 

  if (session && session.user.email !== searchParams?.email) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-t" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
              <h1 className="text-xl mb-5">
                You are logged in with a different email address than the one
                invited
              </h1>
              <p className="text-center">
                Please logout, or login with the invited e-mail if you already
                have an account, then return to this page to accept the
                invitation.
              </p>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-t" />
      <div className=" items-center justify-center ">
        <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
          {searchParams?.organizationId && (
            <TeamInvitationIndex
              organization={organization.data?.success ?? null}
              email={searchParams?.email}
            />
          )}
        </div>
      </div>
    </>
  );
}
