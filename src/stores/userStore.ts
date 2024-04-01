import { create } from "zustand";
import { getUser, getUsers } from "../helpers/db/users.action";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";
import { iUsers } from "../types/db/iUsers";

type Store = {
  userStore: iUsers;
  usersStore: iUsers[];
  setUserStore: (partialSettings: iUsers) => void;
  setUsersStoreByEmail: (email: string, partialSettings: iUsers) => void;
  fetchUserStore: (email: string) => Promise<void>;
  fetchUsersStore: () => Promise<void>;
  isUserStoreLoading: boolean;
};

export const useUserStore = create<Store>()((set) => ({
  userStore: {} as iUsers,
  usersStore: [] as iUsers[],
  isUserStoreLoading: false,
  setUserStore: (partialSettings) =>
    set((state) => ({
      ...state,
      isStoreLoading: false,
      userStore: { ...state.userStore, ...partialSettings },
    })),
  setUsersStoreByEmail: (email, partialSettings) =>
    set((state) => ({
      ...state,
      isStoreLoading: false,
      usersStore: state.usersStore.map((user) =>
        user.email === email ? { ...user, ...partialSettings } : user
      ),
    })),
  fetchUserStore: async (email: string) => {
    set({ isUserStoreLoading: true });
    const user = await getUser({ email: email, secret: chosenSecret() });
    if (!user.data?.success) {
      console.error(user.serverError);
      throw new Error(user.serverError || "Failed to fetch user");
    }
    set({ userStore: user.data.success, isUserStoreLoading: false });
  },
  fetchUsersStore: async () => {
    set({ isUserStoreLoading: true });
    const users = await getUsers({ secret: chosenSecret() });
    if (!users.data?.success) {
      console.error(users.serverError);
      throw new Error(users.serverError || "Failed to fetch users");
    }
    set({ usersStore: users.data.success, isUserStoreLoading: false });
  },
}));
