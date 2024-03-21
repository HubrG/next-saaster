"use client";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Your password must be at least 6 characters.",
  }),
});

export default function Credentials() {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const formData = values;
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: true,
    });
    setIsLoading(false)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 -mt-10">
        <Field
          type="email"
          label="Email"
          name="email"
          placeholder="Email"
          form={form}
        />
        <Field
          type="password"
          label="Password"
          name="password"
          placeholder="Password"
          form={form}
        />
        <ButtonWithLoader loading={isLoading} disabled={isLoading} type="submit" className="w-full">
          Login with email
        </ButtonWithLoader>
      </form>
    </Form>
  );
}
