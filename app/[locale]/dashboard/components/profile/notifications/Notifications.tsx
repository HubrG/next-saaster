"use client";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Switch } from "@/src/components/ui/switch";
import { updateNotificationSettings } from "@/src/helpers/db/notifications.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useNotificationSettingsStore } from "@/src/stores/admin/notificationSettingsStore";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { BellDot, Mail } from "lucide-react";
import { useState } from "react";

export const ProfileNotifications = () => {
  const {
    notificationTypesStore,
    notificationSettingsStore,
    fetchNotificationSettingsStore,
  } = useNotificationSettingsStore();
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const { userInfoStore } = useUserInfoStore();
  const handleToggle = async (
    typeId: string,
    method: "email" | "push",
    currentValue: boolean
  ) => {
    setLoadingType(`${typeId}-${method}`);
    const userId = userInfoStore.info.id; // Remplace par l'ID de l'utilisateur actuel
    const settings = notificationSettingsStore.find(
      (setting) => setting.typeId === typeId
    );

    const up = await updateNotificationSettings({
      userId,
      typeId,
      email: method === "email" ? !currentValue : settings?.email || false,
      push: method === "push" ? !currentValue : settings?.push || false,
      sms: settings?.sms || false,
      secret: chosenSecret(),
    });
    if (handleError(up).error) {
      toaster({
        description: "Failed to update notification settings",
        type: "error",
      });
    }
    fetchNotificationSettingsStore(userId);
    setLoadingType(null);
  };

  return (
    <>
      <div className="grid grid-cols-12 w-full gap-2 items-center mt-14 mb-5">
        <div className="col-span-8"></div>
        <div className="col-span-2 justify-items-center">
          <Mail className="mx-auto" />
        </div>
        <div className="col-span-2 justify-items-center">
          <BellDot className="mx-auto" />
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-2">
        {notificationTypesStore.map((notificationType) => {
          const settings = notificationSettingsStore.find(
            (setting) => setting.typeId === notificationType.id
          );
          return (
            <div
              className="grid grid-cols-12 w-full gap-2 items-center justify-start"
              key={notificationType.id}>
              <div className="col-span-8">
                <p className="text-left text-base">{notificationType.name}</p>
                <p className="opacity-50 text-sm -mt-1">
                  {notificationType.description}
                </p>
              </div>
              <div className="col-span-2">
                {loadingType === `${notificationType.id}-email` ? (
                  <SimpleLoader
                    className="m-auto"
                    style={{ margin: "auto" }}
                    size={20}
                  />
                ) : (
                  <Switch
                    checked={settings?.email || false}
                    onCheckedChange={() =>
                      handleToggle(
                        settings?.typeId ?? "",
                        "email",
                        settings?.email || false
                      )
                    }
                  />
                )}
              </div>
              <div className="col-span-2">
                {loadingType === `${notificationType.id}-push` ? (
                  <SimpleLoader
                    style={{ margin: "auto" }}
                    className="mx-auto !flex-none"
                    size={20}
                  />
                ) : (
                  <Switch
                    checked={settings?.push || false}
                    onCheckedChange={() =>
                      handleToggle(
                        settings?.typeId ?? "",
                        "push",
                        settings?.push || false
                      )
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
