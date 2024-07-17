"use client";

import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { PopoverDelete } from "@/src/components/ui/@fairysaas/popover-delete";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Textarea } from "@/src/components/ui/textarea";
import {
  addNotificationType,
  deleteNotificationType,
  updateNotificationType,
} from "@/src/helpers/db/notifications.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useNotificationSettingsStore } from "@/src/stores/admin/notificationSettingsStore";
import { iNotificationType } from "@/src/types/db/iNotifications";
import { random } from "lodash";
import { BellRing, Check } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

export const ManageNotificationType = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { notificationTypesStore, addNotificationTypeToStore } =
    useNotificationSettingsStore();

  const handleAddNotificationType = async () => {
    setLoading(true);
    const name = "Type-" + random(0, 1000);
    const add = await addNotificationType({
      name,
      secret: chosenSecret(),
    });
    if (handleError(add).error) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to add notification type.`,
      });
    }
    if (!add.data?.success) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to add « ${name} » notification type.`,
      });
    }
    await addNotificationTypeToStore(add.data?.success);
    setLoading(false);
    return toaster({
      type: "success",
      description: `« ${name} » added successfully.`,
    });
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full mt-5">
        <Button type="button" className="w-full">
          <BellRing className="icon" />
          Manage Notification Types
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[50vh] overflow-auto">
        <div className="grid">
          {notificationTypesStore.map((type, index) => (
            <div className="mb-2 py-1" key={type.id}>
              <NotificationTypeCard type={type} />
            </div>
          ))}
          <Button onClick={handleAddNotificationType}>
            {loading ? <SimpleLoader /> : <BellRing className="icon" />} Add
            notification Type
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type Props = {
  type: iNotificationType;
};

export const NotificationTypeCard = ({ type }: Props) => {
  const [data, setData] = useState<string>(type.name);
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(type.description ?? ""); 
  const {
    removeNotificationTypeFromStore,
    updateNotificationTypeNameFromStore,
  } = useNotificationSettingsStore();

  const handleDelete = async () => {
    setLoading(true);
    const remove = await deleteNotificationType({
      id: type.id,
      secret: chosenSecret(),
    });
    if (handleError(remove).error) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to delete notification type.`,
      });
    }
    if (!remove.data?.success) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to delete « ${type.name} » notification type.`,
      });
    }
    //
    await removeNotificationTypeFromStore(remove.data?.success.id);
    setLoading(false);
    return toaster({
      type: "success",
      description: `« ${type.name} » deleted successfully.`,
    });
  };

  const handleSave = async () => {
    if (data === "") {
      return toaster({
        type: "error",
        description: `Please, enter a name`,
      });
    }
    setLoading(true);
    const update = await updateNotificationType({
      id: type.id,
      name: data,
      description,
      secret: chosenSecret(),
    });
    if (handleError(update).error) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to update notification type.`,
      });
    }
    if (!update.data?.success) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Failed to update « ${data} » notification type.`,
      });
    }
    await updateNotificationTypeNameFromStore(update.data?.success.id, data, description);
    setLoading(false);
    return toaster({
      type: "success",
      description: `« ${data} » updated successfully.`,
    });
  };

  return (
    <div className="grid grid-cols-12  gap-3 gap-y-0 !mb-0">
      <div className="col-span-8">
        <Input
          className="w-full rounded-b-none"
          onChange={(e) => setData(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          value={data}
        />
      </div>
      <div className="col-span-8">
        <Textarea
          className="w-full border-t-0 rounded-t-none"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Enter description"
        />
      </div>
      <div className="col-span-2">
        <Button
          onClick={handleSave}
          data-tooltip-id={`${type.id}tt-save-button`}>
          {loading ? (
            <SimpleLoader className="icon" />
          ) : (
            <Check className="icon mx-auto" />
          )}
          <Tooltip
            className="tooltip"
            opacity={100}
            id={`${type.id}tt-save-button`}
            place="top">
            Save
          </Tooltip>
        </Button>
      </div>
      <div className="col-span-1">
        <PopoverDelete what="ce type" size="icon" handleDelete={handleDelete} />
      </div>
    </div>
  );
};
