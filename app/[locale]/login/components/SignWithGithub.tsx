import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useTransition } from "react";

export const SignWithGithub = () => {
  const [isPending, startTransition] = useTransition();

  const onGithubSignIn = async () => {
    await signIn("github");
  };

  return (
    <Button
      onClick={() => startTransition(onGithubSignIn)}
      className="inline-flex h-10 w-full items-center justify-center gap-2 ">
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
      Login with GitHub
    </Button>
  );
};
