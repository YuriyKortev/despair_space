import { en } from './translations/en';
import { ru } from './translations/ru';
import type { Language, Translation } from './types';

export type { Language, Translation, TranslationStrings, TranslationDescriptions, DescriptionEntry } from './types';

export const translations: Record<Language, Translation> = {
  en,
  ru,
};

export const getTranslation = (language: Language): Translation => {
  return translations[language];
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
};

export const availableLanguages: Language[] = ['en', 'ru'];
