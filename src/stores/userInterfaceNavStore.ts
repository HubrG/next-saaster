import { create } from "zustand";

interface MenuItem {
  id: string;
  parent?: string;
  open?: boolean;
  forceOpen?: boolean;
}

type Store = {
  userInterfaceNav: Record<string, MenuItem>;
  setUserInterfaceNav: (
    id: string,
    parent?: string,
    open?: boolean,
    forceOpen?: boolean
  ) => void;
  toggleItemOpen: (id: string) => void;
  setForceOpen: (id: string, forceOpen: boolean) => void;
  openItem: (id: string) => void;
  closeItem: (id: string) => void;
};

export const useUserInterfaceNavStore = create<Store>((set) => ({
  userInterfaceNav: {},
  setUserInterfaceNav: (id, parent, open = false, forceOpen = false) =>
    set((state) => ({
      userInterfaceNav: {
        ...state.userInterfaceNav,
        [id]: { ...state.userInterfaceNav[id], id, parent, open, forceOpen },
      },
    })),
  toggleItemOpen: (id) =>
    set((state) => ({
      userInterfaceNav: {
        ...state.userInterfaceNav,
        [id]: {
          ...state.userInterfaceNav[id],
          open: !state.userInterfaceNav[id]?.open,
        },
      },
    })),
  setForceOpen: (id, forceOpen) =>
    set((state) => ({
      userInterfaceNav: {
        ...state.userInterfaceNav,
        [id]: {
          ...state.userInterfaceNav[id],
          forceOpen,
        },
      },
    })),
  openItem: (id) =>
    set((state) => ({
      userInterfaceNav: {
        ...state.userInterfaceNav,
        [id]: {
          ...state.userInterfaceNav[id],
          open: true,
        },
      },
    })),
  closeItem: (id) =>
    set((state) => {
      if (!state.userInterfaceNav[id]?.forceOpen) {
        return {
          userInterfaceNav: {
            ...state.userInterfaceNav,
            [id]: {
              ...state.userInterfaceNav[id],
              open: false,
            },
          },
        };
      }
      return state;
    }),
}));
