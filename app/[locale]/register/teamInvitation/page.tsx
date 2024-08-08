import { DivFullScreenGradient } from "@/src/components/ui/@blitzinit/layout-elements/gradient-background";
import { Card } from "@/src/components/ui/@shadcn/card";
import { getOrganization } from "@/src/helpers/db/organization.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { TeamInvitationIndex } from "./components/Index";
import { LogoutInviteButton } from "./components/logoutButton";

export default async function TeamInvitation({
  searchParams,
}: {
  searchParams?: { organizationId: string; email: string };
  }) {
  const t = await getTranslations();
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
              <h1 className="text-xl mb-5">{t("Register.TeamInvitationPage.invitation-not-found")}</h1>
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
                {t("Register.TeamInvitationPage.invited-with-different-email")}
              </h1>
              <p className="text-center">
                {t("Register.TeamInvitationPage.please-logout")}
              </p>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (session && session.user.email === searchParams?.email) {
   return <>  <DivFullScreenGradient gradient="gradient-to-t" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
          <LogoutInviteButton /> </Card></div>
      </div></>
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
