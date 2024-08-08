"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Form } from "@/src/components/ui/@shadcn/form";
import { Field } from "@/src/components/ui/@shadcn/form-field";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "../../dashboard/queries/profile.action";

type IndexProps = {
  userEmail: Session["user"]["email"] | undefined | null;
  token: string | undefined | null;
};

export const Index = ({ token, userEmail }: IndexProps) => {
  const t = useTranslations("ForgotPassword.Components.Index");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = z
    .object({
      email: z.string().email({
        message: t("form.email-error"),
      }),
      password: z.string().min(6, {
        message: t("form.password-error", {
          min: 6,
        }),
      }),
      confirmPassword: z.string().min(6, {
        message: t("form.password-error", {
          min: 6,
        }),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: t("form.password-match-error"),
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
      description: t("form.success"),
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
            label={t("form.email")}
            name="email"
            form={form}
          />
          <Field
            type="password"
            label={t("form.new-password")}
            name="password"
            form={form}
          />
          <Field
            type="password"
            label={t("form.confirm-password")}
            name="confirmPassword"
            form={form}
          />
          <Goodline className="!mt-10" />
          <ButtonWithLoader
            type="submit"
            loading={isLoading}
            disabled={isLoading || !form.formState.isValid}
            className={cn({ disabled: isLoading }, "w-full !mt-10 mb-0")}>
            {t("form.submit")}
          </ButtonWithLoader>
        </div>
      </form>
    </Form>
  );
};
