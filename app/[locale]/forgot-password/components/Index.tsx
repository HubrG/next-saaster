"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "../../dashboard/queries/profile.action";

type IndexProps = {
  userEmail: Session["user"]["email"] | undefined | null;
  token: string | undefined | null;
};

export const Index = ({ token, userEmail }: IndexProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = z
    .object({
      email: z.string().email({
        message: "Invalid email address.",
      }),
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { confirmPassword, ...formData } = values;
    const changePassword = await resetPassword({
      email: userEmail ?? formData.email,
      password: formData.password,
      token: token ?? "",
    });
    console.log(changePassword);
    if (handleError(changePassword).error) {
      toaster({
        type: "error",
        description: handleError(changePassword).message,
      });
      setIsLoading(false);
      return;
    }
    toaster({
      type: "success",
      duration: 5000,
      description: "Password reset successfully.",
    });
    form.reset({
      email: "",
      password: "",
      confirmPassword: "",
    });
    if (!userEmail) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail ?? "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative")}>
        <div className={cn("space-y-3 -mt-10")}>
          <Field
            className={cn({ "opacity-50 pointer-events-none": userEmail })}
            type="email"
            label="Your email address"
            name="email"
            form={form}
          />
          <Field
            type="password"
            label="New password"
            name="password"
            form={form}
          />
          <Field
            type="password"
            label="Confirm password"
            name="confirmPassword"
            form={form}
          />
          <Goodline className="!mt-10" />
          <ButtonWithLoader
            type="submit"
            loading={isLoading}
            disabled={isLoading || !form.formState.isValid}
            className={cn({ disabled: isLoading }, "w-full !mt-10 mb-0")}>
            Update password
          </ButtonWithLoader>
        </div>
      </form>
    </Form>
  );
};
