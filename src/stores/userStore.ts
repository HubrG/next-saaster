import { create } from "zustand";
import { getUser } from "../helpers/db/users";
import { iUsers } from "../types/iUsers";

type Store = {
  userStore: iUsers;
  setUserStore: (partialSettings: iUsers) => void;
  fetchUserStore: (email:string) => Promise<void>;
};

export const useUserStore = create<Store>()((set) => ({
  userStore: {} as iUsers,
  setUserStore: (partialSettings) =>
    set((state) => ({
      ...state,
      appSettings: { ...state.userStore, ...partialSettings },
    })),
  fetchUserStore: async (email:string) => {
    const user = await getUser({ email: email });
    if (!user.data) throw new Error(user.error);
    set({ userStore: user.data });
  },
}));
