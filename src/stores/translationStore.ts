// translationStore.ts
import { create } from "zustand";

type TranslationStore = {
  priceTitleTranslations: Record<string, { name: string; description: string }>;
  setPriceTitleTranslations: (
    key: string,
    value: { name: string; description: string }
  ) => void;
  featureTranslations: Record<string, { name: string; description: string, category: string }>;
  setFeatureTranslations: (
    key: string,
    value: { name: string; description: string, category: string}
  ) => void;
};

export const useTranslationStore = create<TranslationStore>((set) => ({
  featureTranslations: {},
  setFeatureTranslations: (key, value) =>
    set((state) => ({
      featureTranslations: { ...state.featureTranslations, [key]: value },
    })),
  priceTitleTranslations: {},
  setPriceTitleTranslations: (key, value) =>
    set((state) => ({
      priceTitleTranslations: { ...state.priceTitleTranslations, [key]: value },
    })),
}));
