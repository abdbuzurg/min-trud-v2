export const APP_LANGUAGES = ["ru", "en", "tj"] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const DEFAULT_APP_LANGUAGE: AppLanguage = "ru";

export const APP_LANGUAGE_STORAGE_KEY = "app-language";
export const APP_LANGUAGE_COOKIE_KEY = "app-language";

export const APP_LANGUAGE_LABELS: Record<AppLanguage, string> = {
  ru: "Русский",
  en: "English",
  tj: "Тоҷикӣ",
};
