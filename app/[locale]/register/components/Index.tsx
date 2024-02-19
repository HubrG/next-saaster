"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/card";
import { Link } from "@/src/lib/intl/navigation";
import { Suspense } from "react";
import { SignWithGoogle } from "../../login/components/SignWithGoogle";
import Credentials from "./SignUpWithCredentials";

export const Index = () => {
  return (
    <Card className="my-card">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="md:text-4xl sm:text-2xl text-xl">Register an account</h1>
        <div className="mt-7 flex flex-col gap-2">
          <Goodline />
          <Suspense>
            <SignWithGoogle />
            <Goodline />
            <Credentials />
          </Suspense>
          <p>
            Already have an account ? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </Card>
  );
};
