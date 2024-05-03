"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Form } from "@/src/components/ui/form";
import { Field } from "@/src/components/ui/form-field";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import useSaveAndCancel, {
  GenericDataObject,
} from "@/src/hooks/useSaveAndCancel";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SaasPicture } from "./subcomponents/SaasPicture";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters."),
  baseline: z.string().min(2, "Baseline must be at least 2 characters."),
});

export const InfoApp = () => {
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: appSettings?.name ?? "",
      description: appSettings?.description ?? "",
      baseline: appSettings?.baseline ?? "",
    },
  });

  const {
    isLoading,
    isDirty,
    handleReset,
    initialData,
    handleSave,
    handleChange,
  } = useSaveAndCancel({
    initialData: {
      name: appSettings.name,
      description: appSettings.description,
      baseline: appSettings.baseline,
    } as GenericDataObject,
    onSave: async (data) => {
      const updateInfo = await updateAppSettings(appSettings.id, data, chosenSecret());
      if (updateInfo) {
        setAppSettings({ ...appSettings, ...data });
        toaster({ description: "Informations updated", type: "success" });
      } else {
        toaster({
          description: "Informations not updated, please try again",
          type: "error",
        });
      }
    },
    onReset: async () => {
      form.reset(initialData);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => handleSave(data);

  return (
    <div className="grid grid-cols-2 items-center justify-center">
      <Form {...form}>
        <form
          className="flex flex-col space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => {
            handleChange(form.getValues());
          }}>
          <Field
            label="Company name"
            name="name"
            placeholder="Company name"
            description="This will be used as the title of the website, logo and SEO"
            form={form}
          />
          <Field
            label="Baseline"
            name="baseline"
            description="On base meta title for SEO"
            placeholder="Your baseline"
            form={form}
          />
          <Field
            type="textarea"
            label="Description"
            className="!h-22"
            name="description"
            description={`${
              form.watch("description").length
            } chars — The maximum recommended size for the meta description (SEO) was often between 150 and 160 characters max.`}
            placeholder="Description"
            form={form}
          />
          <div className="flex justify-between space-x-4 mt-10">
            <ButtonWithLoader
              type="button"
              disabled={!isDirty || isLoading}
              variant="link"
              onClick={() => {
                handleReset();
              }}>
              Reset
            </ButtonWithLoader>
            <ButtonWithLoader
              type="submit"
              disabled={!isDirty || isLoading}
              loading={isLoading}>
              Update
            </ButtonWithLoader>
          </div>
        </form>
      </Form>
      <SaasPicture />
    </div>
  );
};
