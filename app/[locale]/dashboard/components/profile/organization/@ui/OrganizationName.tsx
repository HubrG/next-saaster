// RenameOrganization.tsx
"use client";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { updateOrganization } from "@/src/helpers/db/organization.action";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { iUsers } from "@/src/types/db/iUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type RenameOrganizationProps = {
  user: iUsers;
};

export const OrganizationName = ({ user }: RenameOrganizationProps) => {
  const { setOrganizationStore, organizationStore } = useOrganizationStore();

  const formNameSchema = z.object({
    name: z.string().min(1),
  });

  const formName = useForm<z.infer<typeof formNameSchema>>({
    resolver: zodResolver(formNameSchema),
    defaultValues: {
      name: user.organization?.name ?? "",
    },
  });

  const handleNameSubmit = async (values: z.infer<typeof formNameSchema>) => {
    const formData = values;
    setOrganizationStore({ ...organizationStore, name: formData.name });
    const update = await updateOrganization({
      id: user.organizationId ?? "",
      name: formData.name,
    });
    if (update.serverError) {
      setOrganizationStore({
        ...organizationStore,
        name: user.organization?.name ?? "",
      });
      toaster({ type: "error", description: update.serverError });
    } else {
      setOrganizationStore({ ...organizationStore, name: formData.name });
      toaster({ type: "success", description: "Organization renamed" });
    }
  };

  return (
    <Form {...formName}>
      <form
        onSubmit={formName.handleSubmit(handleNameSubmit)}
        className="space-y-3 -mt-10">
        <Field
          type="text"
          label="Organization name"
          name="name"
          placeholder="Name"
          form={formName}
        />
        <ButtonWithLoader
          type="submit"
          loading={formName.formState.isSubmitting}
          disabled={!formName.formState.isValid || formName.formState.isSubmitting}
          className="w-full">
          Rename
        </ButtonWithLoader>
      </form>
    </Form>
  );
};
