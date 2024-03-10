import { create } from "zustand";
import { getUser } from "../helpers/db/users.action";
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
    const user = await getUser({ email: email });
    if (!user.data) throw new Error(user.error);
    set({ userStore: user.data, isStoreLoading: false });
  },
}));
