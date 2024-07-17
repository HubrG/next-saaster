import {
  getNotificationTypes,
  getNotificationsSettings,
} from "@/src/helpers/db/notifications.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import {
  iNotificationSettings,
  iNotificationType,
} from "@/src/types/db/iNotifications";
import { create } from "zustand";

type Store = {
  notificationSettingsStore: iNotificationSettings[];
  fetchNotificationSettingsStore: (userId: string) => Promise<void>;
  setNotificationSettingsStore: (partialSettings: iNotificationSettings[]) => void;
  notificationTypesStore: iNotificationType[];
  setNotificationTypesStore: (partialSettings: iNotificationType[]) => void;
  fetchNotificationTypesStore: () => Promise<void>;
  isNotificationStoreLoading: boolean;
  addNotificationTypeToStore: (data: iNotificationType) => Promise<void>;
  removeNotificationTypeFromStore: (typeId: string) => Promise<void>;
  updateNotificationTypeNameFromStore: (
    typeId: string,
    newName: string,
    description?: string
  ) => Promise<void>;
};

export const useNotificationSettingsStore = create<Store>()((set) => ({
  notificationTypesStore: [] as iNotificationType[],
  isNotificationStoreLoading: true,
  setNotificationTypesStore: (partialSettings) =>
    set((state) => ({
      ...state,
      isNotificationStoreLoading: false,
      notificationTypesStore: [
        ...state.notificationTypesStore,
        ...partialSettings,
      ],
    })),
  fetchNotificationTypesStore: async () => {
    const notificationTypes = await getNotificationTypes({
      secret: chosenSecret(),
    });
    if (!notificationTypes.data?.success) {
      console.error(notificationTypes.serverError);
      throw new Error(
        notificationTypes.serverError || "Failed to fetch notification types"
      );
    }
    set({
      notificationTypesStore: notificationTypes.data.success,
      isNotificationStoreLoading: false,
    });
  },
  addNotificationTypeToStore: async (data: iNotificationType) => {
    set({ isNotificationStoreLoading: false });

    set((state) => ({
      notificationTypesStore: [
        ...state.notificationTypesStore,
        data as iNotificationType,
      ],
      isNotificationStoreLoading: false,
    }));
    set({ isNotificationStoreLoading: false });
  },
  removeNotificationTypeFromStore: async (typeId: string) => {
    console.log(typeId);
    set({ isNotificationStoreLoading: true });
    set((state) => ({
      notificationTypesStore: state.notificationTypesStore.filter(
        (type) => type.id !== typeId
      ),
      isNotificationStoreLoading: false,
    }));
    set({ isNotificationStoreLoading: false });
  },
  updateNotificationTypeNameFromStore: async (
    typeId: string,
    newName: string,
    description?: string
  ) => {
 set({ isNotificationStoreLoading: false });
    set((state) => ({
      notificationTypesStore: state.notificationTypesStore.map((type) =>
        type.id === typeId
          ? {
              ...type,
              name: newName,
              description: description ? description : type.description,
            }
          : type
      ),
      isNotificationStoreLoading: false,
    }));

    set({ isNotificationStoreLoading: false });
  },
  // Notification Settings
  notificationSettingsStore: [] as iNotificationSettings[],
  fetchNotificationSettingsStore: async (userId: string) => {
    set({ isNotificationStoreLoading: false });
    const notificationSettings = await getNotificationsSettings({
      secret: chosenSecret(),
      userId,
    });
    if (!notificationSettings.data?.success) {
      console.error(notificationSettings.serverError);
      throw new Error(
        notificationSettings.serverError ||
          "Failed to fetch notification settings"
      );
    }
    set({
      notificationSettingsStore: notificationSettings.data.success,
      isNotificationStoreLoading: false,
    });
  },
  setNotificationSettingsStore: (partialSettings) =>
    set((state) => ({
      ...state,
      isNotificationStoreLoading: false,
      notificationSettingsStore: [
        ...state.notificationSettingsStore,
        ...partialSettings,
      ],
    }),
  ),
}));
