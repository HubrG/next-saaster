import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/card";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import { authOptions } from "@/src/lib/next-auth/auth";
import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { Index } from "./components/Index";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: { token: string };
}) {
  const session = await getServerSession(authOptions);
  const isTokenExist = await prisma.verificationToken.findFirst({
    where: {
      token: searchParams?.token,
    },
  });
  // if token is not found
  if (!isTokenExist) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-t" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
              <h1 className="text-xl mb-5">Token not found</h1>
            </Card>
          </div>
        </div>
      </>
    );
  }
  // if user is logged in and token is not valid
  if (
    session &&
    session?.user.email &&
    session?.user.email !== isTokenExist.identifier
  ) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-t" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
              <h1 className="text-xl mb-5">Your token is not valid.</h1>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (isTokenExist.expires < new Date()) {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-t" />
        <div className=" items-center justify-center ">
          <div className="lg:w-2/5  sm:3/5 max-sm:w-full px-5 mx-auto self-center ">
            <Card>
              <h1 className="text-xl mb-5">Token expired</h1>
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
          <Card>
            <h1 className="text-xl mb-5">Reset your password</h1>
            <Goodline className="mb-20 mt-10" />
            <Index
              token={searchParams?.token}
              userEmail={session?.user.email}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
