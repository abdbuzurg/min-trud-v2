"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { APP_LANGUAGE_COOKIE_KEY, AppLanguage } from "./types";
import { getNextIntlMessages, translateRuText } from "./translate";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (nextLanguage: AppLanguage) => void;
  translate: (text: string) => string;
  // Forms with unsaved user input register a warning so a language switch
  // (which reloads the page) asks for confirmation first.
  setLanguageChangeWarning: (enabled: boolean) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const UNSAVED_DATA_WARNING =
  "При смене языка введённые данные будут потеряны. Продолжить?";

type LanguageProviderProps = PropsWithChildren<{
  initialLanguage: AppLanguage;
}>;

export function LanguageProvider({ initialLanguage, children }: LanguageProviderProps) {
  // The language is fixed for the lifetime of the page: switching writes the
  // cookie and reloads, so the server renders the next page in the new language.
  const language = initialLanguage;
  const warnBeforeChangeRef = useRef(false);
  const originalAlertRef = useRef<typeof window.alert | null>(null);

  const translate = useCallback(
    (text: string) => translateRuText(text, language),
    [language]
  );

  const setLanguageChangeWarning = useCallback((enabled: boolean) => {
    warnBeforeChangeRef.current = enabled;
  }, []);

  const setLanguage = useCallback(
    (nextLanguage: AppLanguage) => {
      if (nextLanguage === language) {
        return;
      }

      if (
        warnBeforeChangeRef.current &&
        !window.confirm(translateRuText(UNSAVED_DATA_WARNING, language))
      ) {
        return;
      }

      document.cookie = `${APP_LANGUAGE_COOKIE_KEY}=${encodeURIComponent(nextLanguage)}; path=/; max-age=31536000; samesite=lax`;
      window.location.reload();
    },
    [language]
  );

  // alert() is the one display channel components can't wrap in translate(),
  // so Russian messages are translated at this single choke point.
  useEffect(() => {
    if (!originalAlertRef.current) {
      originalAlertRef.current = window.alert.bind(window);
    }

    const baseAlert = originalAlertRef.current;
    window.alert = (message?: unknown) => {
      if (typeof message === "string") {
        baseAlert(translateRuText(message, language));
        return;
      }

      baseAlert(message as never);
    };

    return () => {
      window.alert = baseAlert;
    };
  }, [language]);

  const nextIntlMessages = useMemo(() => getNextIntlMessages(language), [language]);

  const contextValue = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      translate,
      setLanguageChangeWarning,
    }),
    [language, setLanguage, translate, setLanguageChangeWarning]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={language} messages={nextIntlMessages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
