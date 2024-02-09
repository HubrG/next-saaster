"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader, SimpleLoader } from "@/src/components/ui/loader";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { useTransition } from "react";
import { Link } from '@/src/lib/intl/navigation';

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
const onGithubSignIn = async () => {
  await signIn("github");
};
const onGoogleSignIn = async () => {
  await signIn("google");
};
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <div className="mt-7 flex flex-col gap-2">
            <Button
              onClick={() => startTransition(onGithubSignIn)}
              variant={"outline"}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending ? (
                <SimpleLoader className="mr-2 h-4 w-4" />
              ) : (
                <Image
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="Continue with Github"
                  className="h-[18px] w-[18px] "
                  height={18}
                  width={18}
                />
              )}
              Continue with GitHub
            </Button>
            <Button
              variant={"outline"}
              onClick={() => startTransition(onGoogleSignIn)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending ? (
                <SimpleLoader className="mr-2 h-4 w-4" />
              ) : (
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Continue with Google"
                  className="h-[18px] w-[18px] "
                  height={18}
                  width={18}
                />
              )}
              Continue with Google
            </Button>
          </div>

          <form className="space-y-4 md:space-y-6" action="/">
            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </Label>
              <Input
                name="passwords"
                id="passwords"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              Sign in
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                href="/"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
