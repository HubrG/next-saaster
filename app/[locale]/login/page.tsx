import { LoginForm } from "@/src/components/pages/login/LoginForm";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full  md:h-screen h-auto flex justify-center items-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}