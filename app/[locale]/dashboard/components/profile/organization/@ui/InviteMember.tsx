"use client";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { inviteMemberToOrganization } from "@/src/helpers/db/organization.action";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type InviteMemberProps = {
  user: iUsers;
};
export const InviteMember = ({ user }: InviteMemberProps) => {
  const { organizationStore, fetchOrganizationStore } = useOrganizationStore();
  const formSchema = z.object({
    email: z
      .string()
      .email()
      .refine((email) => email !== user.email, {
        message: "You can't invite yourself",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      reset({
        email: "",
      });
    }
  };

  return (
    <>
      {user.organization?.ownerId === user.id && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 -mt-10">
            <Field
              type="email"
              label="Invite new member"
              name="email"
              placeholder="Email"
              form={form}
            />
            <Button type="submit" disabled={!isValid} className="w-full">
              Invite
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};
