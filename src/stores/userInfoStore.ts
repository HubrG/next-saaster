import { create } from "zustand";
import { updateUserSubscription } from "../helpers/db/userSubscription.action";
import { getUser, updateUser } from "../helpers/db/users.action";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "../helpers/dependencies/user-info";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";

type Store = {
  userInfoStore: ReturnUserDependencyProps;
  setUserInfoStore: (user: ReturnUserDependencyProps) => void;
  isUserInfoStoreLoading: boolean;
  fetchUserInfoStore: (email: string) => Promise<void>;
  setProperty: <T extends keyof ReturnUserDependencyProps>(
    path: T,
    value: ReturnUserDependencyProps[T]
  ) => void;
  decrementCredit: (amount: number) => void;
  incrementCredit: (amount: number) => void;
};

export const useUserInfoStore = create<Store>()((set, get) => ({
  userInfoStore: {} as ReturnUserDependencyProps,
  isUserInfoStoreLoading: false,
  fetchUserInfoStore: async (email: string) => {
    set({ isUserInfoStoreLoading: true });
    const user = await getUser({ email, secret: chosenSecret() });
    if (!user.data?.success) {
      console.error(user.serverError);
      throw new Error(user.serverError || "Failed to fetch user");
    }
    const userInfos = getUserInfos({ user: user.data.success });
    set({ userInfoStore: userInfos, isUserInfoStoreLoading: false });
  },
  setUserInfoStore: (user: ReturnUserDependencyProps) => {
    set({ isUserInfoStoreLoading: true });
    // const userInfos = getUserInfos({ user });
    set({ userInfoStore: user, isUserInfoStoreLoading: false });
  },
  setProperty: (path, value) => {
    const currentStore = { ...get().userInfoStore };
    set({ userInfoStore: { ...currentStore, [path]: value } });
  },
  decrementCredit: async (amount: number) => {
    const currentStore = get().userInfoStore;
    const { info, activeSubscription } = currentStore;
    if (activeSubscription && activeSubscription.creditRemaining !== null) {
      set({
        userInfoStore: {
          ...currentStore,
          activeSubscription: {
            ...activeSubscription,
            creditRemaining: activeSubscription.creditRemaining - amount,
          },
        },
      });
      const decInBDD = await updateUserSubscription({
        data: {
          subscriptionId: activeSubscription.subscription?.id ?? "",
          userId: info.id ?? "",
          creditRemaining: activeSubscription.creditRemaining - amount,
        },
        stripeSignature: process.env.STRIPE_WEBHOOK_SECRET ?? "",
      });
      if (!decInBDD.data?.success) {
        console.error("Error while decrementing credit in BDD");
        throw new Error("Error while decrementing credit in BDD");
      }
    } else if (info.creditRemaining !== null) {
      set({
        userInfoStore: {
          ...currentStore,
          info: {
            ...info,
            creditRemaining: info.creditRemaining - amount,
          },
        },
      });
      const decInBDD = await updateUser({
        data: {
          email: info.email ?? "",
          creditRemaining: info.creditRemaining - amount,
        },
        secret: chosenSecret(),
      });
      if (!decInBDD.data?.success?.id) {
        console.error("Error while decrementing credit in BDD");
        throw new Error("Error while decrementing credit in BDD");
      }
    }
  },
  incrementCredit: async (amount: number) => {
    const currentStore = get().userInfoStore;
    const { info, activeSubscription } = currentStore;
    if (activeSubscription && activeSubscription.creditRemaining !== null) {
      set({
        userInfoStore: {
          ...currentStore,
          activeSubscription: {
            ...activeSubscription,
            creditRemaining: activeSubscription.creditRemaining + amount,
          },
        },
      });
      const incInBDD = await updateUserSubscription({
        data: {
          subscriptionId: activeSubscription.subscription?.id ?? "",
          userId: info.id ?? "",
          creditRemaining: activeSubscription.creditRemaining + amount,
        },
        stripeSignature: process.env.STRIPE_WEBHOOK_SECRET ?? "",
      });
      if (!incInBDD.data?.success) {
        console.error("Error while incrementing credit in BDD");
        throw new Error("Error while incrementing credit in BDD");
      }
    } else if (info.creditRemaining !== null) {
      set({
        userInfoStore: {
          ...currentStore,
          info: {
            ...info,
            creditRemaining: info.creditRemaining + amount,
          },
        },
      });
      const incInBDD = await updateUser({
        data: {
          email: info.email ?? "",
          creditRemaining: info.creditRemaining + amount,
        },
        secret: chosenSecret(),
      });
      if (!incInBDD.data?.success?.id) {
        console.error("Error while incrementing credit in BDD");
        throw new Error("Error while incrementing credit in BDD");
      }
    }
  },
}));
