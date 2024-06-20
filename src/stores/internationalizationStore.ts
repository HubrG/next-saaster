import {
  addInternationalizationDictionary,
  addLanguage,
  getInternationalizationDictionaries,
  getInternationalizations,
  removeInternationalizationDictionary,
  removeLanguage,
  updateInternationalizationDictionary,
} from "@/src/helpers/db/internationalization.action";
import {
  InternationalizationDictionary,
  InternationalizationEnabledList,
} from "@prisma/client";
import { create } from "zustand";
import { chosenSecret } from "../helpers/functions/verifySecretRequest";

type Store = {
  internationalizations: InternationalizationEnabledList[];
  dictionaries: InternationalizationDictionary[];
  setInternationalizations: (
    updater:
      | ((
          currentInter: InternationalizationEnabledList[]
        ) => InternationalizationEnabledList[])
      | InternationalizationEnabledList[]
  ) => void;
  setDictionaries: (
    updater:
      | ((
          currentDict: InternationalizationDictionary[]
        ) => InternationalizationDictionary[])
      | InternationalizationDictionary[]
  ) => void;
  fetchInternationalizations: () => Promise<void>;
  fetchDictionaries: () => Promise<void>;
  addLanguageToStore: (code: string) => Promise<void>;
  addDictionaryToStore: (word: string) => Promise<void>;
  removeLanguageFromStore: (code: string) => Promise<void>;
  removeDictionaryFromStore: (word: string) => Promise<void>;
  updateDictionaryInStore: (id: string, word: string) => Promise<void>;
  isInternationalizationStoreLoading: boolean;
  setInternationalizationStoreLoading: (loading: boolean) => void;
};

export const useInternationalizationStore = create<Store>()((set) => ({
  internationalizations: [],
  dictionaries: [],
  isInternationalizationStoreLoading: false,
  setInternationalizationStoreLoading: (loading) => {
    set({ isInternationalizationStoreLoading: loading });
  },
  setInternationalizations: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({
        internationalizations: updater(state.internationalizations),
        isInternationalizationStoreLoading: false,
      }));
    } else {
      set({
        internationalizations: updater,
        isInternationalizationStoreLoading: false,
      });
    }
  },
  setDictionaries: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({
        dictionaries: updater(state.dictionaries),
        isInternationalizationStoreLoading: false,
      }));
    } else {
      set({
        dictionaries: updater,
        isInternationalizationStoreLoading: false,
      });
    }
  },
  fetchInternationalizations: async () => {
    set({ isInternationalizationStoreLoading: true });
    const internationalizations = await getInternationalizations({
      secret: chosenSecret(),
    });
    if (!internationalizations.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(
        internationalizations.serverError ||
          "Failed to fetch internationalizations"
      );
    }
    set({
      internationalizations: internationalizations.data?.success,
      isInternationalizationStoreLoading: false,
    });
  },
  fetchDictionaries: async () => {
    set({ isInternationalizationStoreLoading: true });
    const dictionaries = await getInternationalizationDictionaries({
      secret: chosenSecret(),
    });
    if (!dictionaries.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(dictionaries.serverError || "Failed to fetch dictionaries");
    }
    set({
      dictionaries: dictionaries.data
        ?.success as unknown as InternationalizationDictionary[],
      isInternationalizationStoreLoading: false,
    });
  },
  addLanguageToStore: async (code) => {
    set({ isInternationalizationStoreLoading: true });
    const result = await addLanguage({ secret: chosenSecret(), code });
    if (!result.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(result.serverError || "Failed to add language");
      return;
    }
    set((state) => {
      const isAlreadyPresent = state.internationalizations.some(
        (lang) => lang.code === code
      );
      if (isAlreadyPresent) {
        set({ isInternationalizationStoreLoading: false });
        console.warn("Language already exists in the store");
        return state;
      }
      return {
        internationalizations: [
          ...state.internationalizations,
          { id: "new-id", code, createdAt: new Date(), updatedAt: new Date() },
        ],
        isInternationalizationStoreLoading: false,
      };
    });
  },
  addDictionaryToStore: async (word) => {
    set({ isInternationalizationStoreLoading: true });
    const result = await addInternationalizationDictionary({
      secret: chosenSecret(),
      word,
    });
    if (!result.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(result.serverError || "Failed to add dictionary");
      return;
    }
    set((state) => {
      const isAlreadyPresent = state.dictionaries.some(
        (dict) => dict.word === word
      );
      if (isAlreadyPresent) {
        set({ isInternationalizationStoreLoading: false });
        console.warn("Dictionary word already exists in the store");
        return state;
      }
      return {
        dictionaries: [
          ...state.dictionaries,
          {
            id: result.data?.success?.id || "new-id",
            word,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        isInternationalizationStoreLoading: false,
      };
    });
  },
  removeLanguageFromStore: async (code) => {
    set({ isInternationalizationStoreLoading: true });
    const result = await removeLanguage({ secret: chosenSecret(), code });
    if (!result.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(result.serverError || "Failed to remove language");
    }
    set((state) => ({
      internationalizations: state.internationalizations.filter(
        (inter) => inter.code !== code
      ),
      isInternationalizationStoreLoading: false,
    }));
  },
  removeDictionaryFromStore: async (word) => {
    set({ isInternationalizationStoreLoading: true });
    const result = await removeInternationalizationDictionary({
      secret: chosenSecret(),
      word,
    });
    if (!result.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(result.serverError || "Failed to remove dictionary");
    }
    set((state) => ({
      dictionaries: state.dictionaries.filter((dict) => dict.word !== word),
      isInternationalizationStoreLoading: false,
    }));
  },
  updateDictionaryInStore: async (id, word) => {
    set({ isInternationalizationStoreLoading: true });
    const result = await updateInternationalizationDictionary({
      secret: chosenSecret(),
      id,
      word,
    });
    if (!result.data?.success) {
      set({ isInternationalizationStoreLoading: false });
      console.error(result.serverError || "Failed to update dictionary");
      return;
    }
    set((state) => ({
      dictionaries: state.dictionaries.map((dict) =>
        dict.id === id ? { ...dict, word } : dict
      ),
      isInternationalizationStoreLoading: false,
    }));
  },
}));

export default useInternationalizationStore;