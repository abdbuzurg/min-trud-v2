"use client";

import { APP_LANGUAGE_LABELS, AppLanguage } from "@/i18n/types";
import { useLanguage } from "@/i18n/LanguageProvider";

const SWITCHER_LABELS: Record<AppLanguage, string> = {
  ru: "Язык",
  en: "Language",
  tj: "Забон",
};

const LANGUAGE_FLAGS: Record<AppLanguage, string> = {
  ru: "🇷🇺",
  en: "🇺🇸",
  tj: "🇹🇯",
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      data-i18n-ignore="true"
      className="fixed right-4 top-4 z-50 rounded-xl border border-green-100 bg-white/95 px-3 py-2 shadow-lg shadow-green-100 backdrop-blur"
    >
      <label className="mr-2 text-xs font-semibold uppercase tracking-wide text-gray-600" htmlFor="app-language-switcher">
        {SWITCHER_LABELS[language]}
      </label>
      <span className="mr-2 text-base leading-none" aria-hidden="true">
        {LANGUAGE_FLAGS[language]}
      </span>
      <select
        id="app-language-switcher"
        value={language}
        onChange={(event) => setLanguage(event.target.value as AppLanguage)}
        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
      >
        <option value="ru">{`${LANGUAGE_FLAGS.ru} ${APP_LANGUAGE_LABELS.ru}`}</option>
        <option value="en">{`${LANGUAGE_FLAGS.en} ${APP_LANGUAGE_LABELS.en}`}</option>
        <option value="tj">{`${LANGUAGE_FLAGS.tj} ${APP_LANGUAGE_LABELS.tj}`}</option>
      </select>
    </div>
  );
}
