import { create } from "zustand";
import { getOrganization } from "../helpers/db/organization.action";
import { iOrganization } from "../types/iOrganization";

type Store = {
  organizationStore: iOrganization;
  setOrganizationStore: (partialSettings: iOrganization) => void;
  fetchOrganizationStore: (email: string) => Promise<void>;
  isStoreLoading: boolean;
  refreshOrganizationStore: (data: iOrganization) => void;
};

export const useOrganizationStore = create<Store>()((set) => ({
  organizationStore: {} as iOrganization,
  isStoreLoading: false,
  refreshOrganizationStore: (data) =>
    set({ organizationStore: data as iOrganization }),
  setOrganizationStore: (partialSettings) =>
    set((state) => ({
      ...state,
      isStoreLoading: false,
      organizationStore: { ...state.organizationStore, ...partialSettings },
    })),
  fetchOrganizationStore: async (id: string) => {
    set({ isStoreLoading: true });
    const orga = (await getOrganization({ id: id }));
    if (!orga.serverError) {
      set({ organizationStore: orga.data?.success, isStoreLoading: false });
    }
  },
}));
