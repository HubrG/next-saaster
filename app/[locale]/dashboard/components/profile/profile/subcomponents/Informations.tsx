"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { updateUser } from "@/src/helpers/db/users.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type InformationProps = {
  user: iUsers;
};

export const ProfileInformation = ({ user }: InformationProps) => {
    const t = useTranslations("Dashboard.Components.Profile.Profile");
  const [loading, setLoading] = useState(false);
  const { setUserStore } = useUserStore();
  const formSchema = z.object({
    name: z.string(),
  });

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });
  //
  const onSubmit = async () => {
    setLoading(true);
    const up = await updateUser({
      data: {
        email: user.email ?? "",
        name: form.getValues("name"),
      },
      secret: chosenSecret(),
    });
    if (handleError(up).error) {
      toaster({ type: "error", description: handleError(up).message });
      setLoading(false);
      return;
    }
    setUserStore({ ...user, name: form.getValues("name") });
    toaster({ type: "success", description: t('toasters.success') });
  };

  return (
    <div className="mt-10">
      <Goodline />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data">
          <Field type="text" label={t('form.name')} name="name" form={form} />
          <ButtonWithLoader
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            type="submit">
            {t('form.submit')}
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
};
