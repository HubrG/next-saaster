"use client";
import { ButtonWithLoader } from "@/src/components/ui/@blitzinit/button-with-loader";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Form } from "@/src/components/ui/@shadcn/form";
import { Field } from "@/src/components/ui/@shadcn/form-field";
import { inviteMemberToOrganization } from "@/src/helpers/db/organization.action";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

type InviteMemberProps = {
  user: iUsers;
};

export const InviteMember = ({ user }: InviteMemberProps) => {
    const t = useTranslations("Dashboard.Components.Profile.Organization.UI.InviteMember");
  const { organizationStore, fetchOrganizationStore } = useOrganizationStore();

  const formInvitationSchema = z.object({
    email: z
      .string()
      .email()
      .refine((email) => email !== user.email, {
        message: t('form.error-you-cant-invite-yourself'),
      }),
  });

  const formInvitation = useForm<z.infer<typeof formInvitationSchema>>({
    resolver: zodResolver(formInvitationSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleInvitationSubmit = async (
    values: z.infer<typeof formInvitationSchema>
  ) => {
    const formData = values;
    const invite = await inviteMemberToOrganization({
      organizationId: organizationStore.id,
      email: formData.email,
    });

    if (handleError(invite).error) {
      toaster({
        type: "error",
        description: handleError(invite).message,
      });
      return
    }  else {
      fetchOrganizationStore(user.organizationId ?? "");
      toaster({
        type: "success",
        description: `${t("toasters.invitation-sent")} ${
          formData.email
        }`,
      });
      formInvitation.reset({
        email: "",
      });
    }
  };

  return (
    <Form {...formInvitation}>
      <form
        onSubmit={formInvitation.handleSubmit(handleInvitationSubmit)}
        className="space-y-3 -mt-10">
        <Field
          type="email"
          label={t("form.field-invite-new-member")}
          name="email"
          placeholder={t("form.placeholder-email")}
          form={formInvitation}
        />
        {user.subscriptions?.find((sub) => sub.isActive) && (
          <p className="text-left text-sm">
            <Info className="icon mt-1" /> {t("note")}
          </p>
        )}

        <ButtonWithLoader
          type="submit"
          loading={formInvitation.formState.isSubmitting}
          disabled={
            !formInvitation.formState.isValid ||
            formInvitation.formState.isSubmitting
          }
          className="w-full">
          {t("form.submit")}
        </ButtonWithLoader>
      </form>
    </Form>
  );
};
