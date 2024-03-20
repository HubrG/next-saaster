"use client";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { inviteMemberToOrganization } from "@/src/helpers/db/organization.action";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type InviteMemberProps = {
  user: iUsers;
};

export const InviteMember = ({ user }: InviteMemberProps) => {
  const { organizationStore, fetchOrganizationStore } = useOrganizationStore();

  const formInvitationSchema = z.object({
    email: z
      .string()
      .email()
      .refine((email) => email !== user.email, {
        message: "You can't invite yourself",
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
    if (invite.serverError) {
      toaster({ type: "error", description: invite.serverError });
    } else {
      fetchOrganizationStore(user.organizationId ?? "");
      toaster({
        type: "success",
        description: `Invite sent to ${formData.email}`,
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
              label="Invite new member"
              name="email"
              placeholder="Email"
              form={formInvitation}
            />
                    {user.subscriptions?.find((sub) => sub.isActive) && (
        <p className="text-left text-sm">
        <Info className="icon mt-1" /> Note: you have an active subscription. The addition of a new member to your organization will be billed on a pro-rata basis if the member accepts the invitation.
        </p>)}

            <Button
              type="submit"
              disabled={!formInvitation.formState.isValid}
              className="w-full">
              Invite
        </Button>
          </form>
        </Form>
  );
};
