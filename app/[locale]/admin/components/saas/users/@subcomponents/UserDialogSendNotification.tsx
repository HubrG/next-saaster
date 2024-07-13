import { sendNotification } from "@/app/[locale]/admin/queries/user-info";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/src/components/ui/@fairysaas/credenza";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { cn } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const UserDialogSendNotification = ({
  user,
}: {
  user: ReturnUserDependencyProps;
}) => {
  const t = useTranslations("Admin.Components.UserDialogSendNotification");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    notificationText: z.string().min(1, {
      message: "You must provide a notification text",
    }),
    // {{ edit_1 }}
    title: z.string().min(1, {
      message: "You must provide a title",
    }),
    type: z.string().min(1, {
      message: "You must provide a type (Info, Warning, Error, Success...)",
    }),
    // {{ edit_1 }}
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { notificationText, title, type } = values;
    const send = await sendNotification({
      userId: user.info.id,
      content: notificationText,
      title,
      type,
      id: "",
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!send) {
      toaster({
        type: "error",
        description: "Error while sending notification",
      });
      setIsLoading(false);
      return;
    }

    toaster({
      type: "success",
      description: "Notification sent",
    });
    setOpen(false);
    setIsLoading(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationText: "",
    },
  });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="w-full">
        <Button className="w-full">
          <Bell className="icon" /> Send notification
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader className="flex flex-col gap-y-6">
          <CredenzaTitle>Send notification to {user.info.name}</CredenzaTitle>
          <Goodline />
          <CredenzaContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("relative")}>
                <div className={cn("space-y-3 -mt-10 ")}>
                  {/* {{ edit_2 }} */}
                  <Field
                    type="text"
                    label="Notification title"
                    name="title"
                    form={form}
                  />
                  <Field
                    type="text"
                    label="Notification category"
                    name="type"
                    form={form}
                  />
                  {/* {{ edit_2 }} */}
                  <Field
                    type="textarea"
                    label="Notification text"
                    name="notificationText"
                    form={form}
                  />
                  <Goodline className="!mt-10" />
                  <ButtonWithLoader
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading || !form.formState.isValid}
                    className={cn({ disabled: isLoading }, "w-full !mt-10")}>
                    Send
                  </ButtonWithLoader>
                </div>
              </form>
            </Form>
          </CredenzaContent>
        </CredenzaHeader>
      </CredenzaContent>
    </Credenza>
  );
};
