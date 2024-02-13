"use client";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Your password must be at least 6 characters.",
  }),
});

export default function Credentials() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = values;
    signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: true,
    });
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
        <Button type="submit" className="w-full">
          Login with email
        </Button>
      </form>
    </Form>
  );
}
