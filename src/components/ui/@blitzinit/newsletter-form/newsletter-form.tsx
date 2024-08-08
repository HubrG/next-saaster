"use client";
import { Form } from "@/src/components/ui/@shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Field } from "../../@shadcn/form-field";
import { ButtonWithLoader } from "../button-with-loader";
import { toaster } from "../toaster/ToastConfig";
import { addNewsletterEmail } from "./querie.action";
type NewsletterFormProps = {
  className?: string;
};
export const NewsletterForm = ({ className }: NewsletterFormProps) => {
  const t = useTranslations("Components.UI.NewsletterForm");
  const formSchema = z.object({
    email: z.string().email(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const email = values.email;
    const verifyEmail = await addNewsletterEmail(email);
    if (verifyEmail?.success === false) {
     toaster({
       type: "error",
       description: verifyEmail?.message,
       duration: 5000,
     });
      return;
    }
    toaster({
      type: "success",
      description: verifyEmail?.message,
      duration: 5000,
    });
    form.reset();
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full items-center gap-x-2">
            <Field
              type="email"
              displayLabel={false}
              label={t("form.email")}
              placeholder={t("form.email-exemple") + "@gmail.com"}
              name="email"
              className="mt-1 w-full"
              form={form}
            />
            <ButtonWithLoader
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              className="text-sm w-full"
              type="submit">
              {t("form.submit")}
            </ButtonWithLoader>
          </div>
        </form>
      </Form>
    </div>
  );
};
