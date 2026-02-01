import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Translation } from '../i18n/types';
import { getTranslation } from '../i18n';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'despair-space-language',
    }
  )
);

// Hook to get current translation
export const useTranslation = (): Translation => {
  const language = useLanguageStore((state) => state.language);
  return getTranslation(language);
};

// Hook to get translation strings only
export const useT = () => {
  const translation = useTranslation();
  return translation.strings;
};

// Hook to get descriptions only
export const useDescriptions = () => {
  const translation = useTranslation();
  return translation.descriptions;
};
