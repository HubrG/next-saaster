import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { signIn } from "next-auth/react";
import React from "react";

export const MagicLink = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    signIn("email", { email });
  };
  return (
    <form className="space-y-4 w-full md:space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email">Your email</Label>
        <Input name="email" type="email" id="email" placeholder="example@gmail.com" />
      </div>

      <Button type="submit">Sign in</Button>
    </form>
  );
};
