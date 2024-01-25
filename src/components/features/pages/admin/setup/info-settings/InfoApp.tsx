"use client";
import { updateInfosApp } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  baseline: z.string().min(2, {
    message: "Baseline must be at least 2 characters.",
  }),
});

export const InfoApp = () => {
  const router = useRouter();
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      baseline: data?.baseline ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updateInfo = await updateInfosApp(data?.id, values);
    if (updateInfo) {
      useAppSettingsStore
        .getState()
        .setAppSettings({ ...appSettings, name: values.name });
      return toaster({
        description: `Informations updated`,
        type: "success",
        // onAutoClose: () => {
        //   router.refresh();
        // },
        // onDismiss: () => {
        //   router.refresh();
        // },
      });
    } else {
      return toaster({
        description: `Informations not updated, please try again`,
        type: "error",
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Field
            label="Nom du site (logo, meta title and more)"
            name="name"
            placeholder="SaaSter"
            description="Meta title, logo and more..."
            form={form}
          />
          <Field
            label="Baseline"
            name="baseline"
            description="On base meta title for SEO"
            placeholder="baseline"
            form={form}
          />
          <Field
            label="Description du site"
            name="description"
            description="The maximum recommended size for the meta description (SEO) was often between 150 and 160 characters max."
            placeholder="description"
            form={form}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
