import { create } from "zustand";
import { getUser } from "../helpers/db/users.action";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";
import { iUsers } from "../types/db/iUsers";

type Store = {
  userStore: iUsers;
  setUserStore: (partialSettings: iUsers) => void;
  fetchUserStore: (email: string) => Promise<void>;
  isStoreLoading: boolean;
};

export const useUserStore = create<Store>()((set) => ({
  userStore: {} as iUsers,
  isStoreLoading: false,
  setUserStore: (partialSettings) =>
    set((state) => ({
      ...state,
      isStoreLoading: false,
      userStore: { ...state.userStore, ...partialSettings },
    })),
  fetchUserStore: async (email: string) => {
    set({ isStoreLoading: true });
    const user = await getUser({ email: email, secret: chosenSecret() });
    if (!user.data?.success) {
      console.error(user.serverError)
      throw new Error(user.serverError || "Failed to fetch user");
      }
    set({ userStore: user.data.success, isStoreLoading: false });
  },
}));
