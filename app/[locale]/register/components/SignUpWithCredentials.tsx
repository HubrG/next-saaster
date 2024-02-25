"use client";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { SimpleLoader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import VerifyEmailTemplate from "@/src/emails/VerifyEmailTemplate";
import { sendEmail } from "@/src/helpers/emails/sendEmail";
import { cn } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Must be at least 6 characters.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "The passwords did not match.",
        code: "custom",
      });
    }
  });
type ApiResponse = {
  error?: string;
  message?: string;
  token?: string;
};
export default function Credentials() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { confirmPassword, ...formData } = values;
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    const responseData: ApiResponse = await response.json();
    if (response.ok) {
      try {
        // Resend API (mail)
        await sendEmail({
          to: "hubrgiorgi@gmail.com",
          subject: "Bonjour Monsieur",
          react_template: renderToString(
            VerifyEmailTemplate({ verificationToken: responseData.token ?? "" })
          ),
          tag_name: "category",
          tag_value: "confirm_email",
        });
      } catch (error) {
        console.error("Error sending email", error);
      }
      //
      toaster({
        type: "success",
        description: responseData.message,
        duration: 5000,
      });
      setIsLoading(false);
      router.push("/login");
    } else {
      setIsLoading(false);
      toaster({ type: "error", description: responseData.error });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative")}>
          <SimpleLoader
            className={cn(
              { hidden: !isLoading },
              "!absolute top-[45%] left-[45%]"
            )}
          />
          <div className={cn({ "blur-md": isLoading }, "space-y-3 -mt-10 ")}>
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
            <Field
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm Password"
              form={form}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={cn({ disabled: isLoading }, "w-full")}>
              Register with email
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}