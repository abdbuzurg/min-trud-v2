"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  APP_LANGUAGES,
  APP_LANGUAGE_COOKIE_KEY,
  APP_LANGUAGE_STORAGE_KEY,
  AppLanguage,
  DEFAULT_APP_LANGUAGE,
} from "./types";
import { getNextIntlMessages, translateRuText } from "./translate";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (nextLanguage: AppLanguage) => void;
  translate: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const TRANSLATABLE_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"] as const;
const SKIPPED_TAG_NAMES = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);
const CYRILLIC_REGEX = /[А-Яа-яЁё]/;
const LANGUAGE_CHANGE_EVENT = "app-language-change";

const isAppLanguage = (value: string): value is AppLanguage => {
  return (APP_LANGUAGES as readonly string[]).includes(value);
};

const readLanguageFromCookie = (): AppLanguage | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${APP_LANGUAGE_COOKIE_KEY}=`));

  if (!cookie) {
    return null;
  }

  const value = decodeURIComponent(cookie.split("=")[1] ?? "");
  return isAppLanguage(value) ? value : null;
};

const readStoredLanguage = (): AppLanguage => {
  if (typeof window === "undefined") {
    return DEFAULT_APP_LANGUAGE;
  }

  const localStorageValue = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
  if (localStorageValue && isAppLanguage(localStorageValue)) {
    return localStorageValue;
  }

  return readLanguageFromCookie() ?? DEFAULT_APP_LANGUAGE;
};

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_APP_LANGUAGE);
  const originalTextByNodeRef = useRef(new WeakMap<Text, string>());
  const originalAttributesByElementRef = useRef(new WeakMap<Element, Map<string, string>>());
  const isApplyingRef = useRef(false);
  const originalAlertRef = useRef<typeof window.alert | null>(null);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState((previousLanguage) => {
      if (previousLanguage === nextLanguage) {
        return previousLanguage;
      }

      return nextLanguage;
    });
  }, []);

  useEffect(() => {
    const hydratedLanguage = readStoredLanguage();
    setLanguageState((previousLanguage) =>
      previousLanguage === hydratedLanguage ? previousLanguage : hydratedLanguage
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
    document.cookie = `${APP_LANGUAGE_COOKIE_KEY}=${encodeURIComponent(language)}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = language === "tj" ? "tg" : language;
    document.documentElement.dataset.appLanguage = language;
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: language }));
  }, [language]);

  useEffect(() => {
    const handleLanguageSync = (event: Event): void => {
      const customEvent = event as CustomEvent<string>;
      const nextLanguage = customEvent.detail;

      if (!isAppLanguage(nextLanguage)) {
        return;
      }

      setLanguageState((previousLanguage) => {
        if (previousLanguage === nextLanguage) {
          return previousLanguage;
        }

        return nextLanguage;
      });
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageSync);
    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageSync);
    };
  }, []);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent): void => {
      if (event.key !== APP_LANGUAGE_STORAGE_KEY || !event.newValue) {
        return;
      }

      const nextLanguage = event.newValue;
      if (!isAppLanguage(nextLanguage)) {
        return;
      }

      setLanguageState((previousLanguage) => {
        if (previousLanguage === nextLanguage) {
          return previousLanguage;
        }

        return nextLanguage;
      });
    };

    window.addEventListener("storage", handleStorageSync);
    return () => {
      window.removeEventListener("storage", handleStorageSync);
    };
  }, []);

  const translate = useCallback(
    (text: string) => {
      return translateRuText(text, language);
    },
    [language]
  );

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

  useEffect(() => {
    const root = document.body;
    if (!root) {
      return;
    }

    const shouldSkipNode = (node: Text): boolean => {
      const parent = node.parentElement;
      if (!parent) {
        return true;
      }

      if (parent.closest("[data-i18n-ignore='true']")) {
        return true;
      }

      if (SKIPPED_TAG_NAMES.has(parent.tagName)) {
        return true;
      }

      if ((parent as HTMLElement).isContentEditable) {
        return true;
      }

      const value = node.nodeValue ?? "";
      return value.trim().length === 0;
    };

    const translateTextNodes = (): void => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let currentNode = walker.nextNode();

      while (currentNode) {
        const textNode = currentNode as Text;
        if (!shouldSkipNode(textNode)) {
          const currentValue = textNode.nodeValue ?? "";
          const knownOriginal = originalTextByNodeRef.current.get(textNode);

          if (knownOriginal === undefined) {
            originalTextByNodeRef.current.set(textNode, currentValue);
          } else if (language === "ru") {
            if (knownOriginal !== currentValue) {
              originalTextByNodeRef.current.set(textNode, currentValue);
            }
            currentNode = walker.nextNode();
            continue;
          } else {
            const translatedKnownOriginal = translateRuText(knownOriginal, language);
            if (currentValue !== translatedKnownOriginal && CYRILLIC_REGEX.test(currentValue)) {
              originalTextByNodeRef.current.set(textNode, currentValue);
            }
          }

          const sourceValue = originalTextByNodeRef.current.get(textNode) ?? currentValue;
          const translated = translateRuText(sourceValue, language);
          if (textNode.nodeValue !== translated) {
            textNode.nodeValue = translated;
          }
        }

        currentNode = walker.nextNode();
      }
    };

    const translateAttributes = (): void => {
      const elements = root.querySelectorAll("*");

      for (const element of elements) {
        if (element.closest("[data-i18n-ignore='true']")) {
          continue;
        }

        let originalAttributes = originalAttributesByElementRef.current.get(element);
        if (!originalAttributes) {
          originalAttributes = new Map<string, string>();
          originalAttributesByElementRef.current.set(element, originalAttributes);
        }

        for (const attrName of TRANSLATABLE_ATTRIBUTES) {
          const attrValue = element.getAttribute(attrName);
          if (!attrValue || attrValue.trim().length === 0) {
            continue;
          }

          if (!originalAttributes.has(attrName) || language === "ru") {
            originalAttributes.set(attrName, attrValue);
            if (language === "ru") {
              continue;
            }
          }

          const knownOriginal = originalAttributes.get(attrName) ?? attrValue;
          const translatedKnownOriginal = translateRuText(knownOriginal, language);

          if (attrValue !== translatedKnownOriginal && CYRILLIC_REGEX.test(attrValue)) {
            originalAttributes.set(attrName, attrValue);
          }

          const sourceValue = originalAttributes.get(attrName) ?? attrValue;
          const translatedValue = translateRuText(sourceValue, language);

          if (translatedValue !== attrValue) {
            element.setAttribute(attrName, translatedValue);
          }
        }
      }
    };

    const applyTranslations = (): void => {
      if (isApplyingRef.current) {
        return;
      }

      isApplyingRef.current = true;
      try {
        translateTextNodes();
        translateAttributes();
      } finally {
        isApplyingRef.current = false;
      }
    };

    applyTranslations();

    const observer = new MutationObserver(() => {
      if (isApplyingRef.current) {
        return;
      }

      window.requestAnimationFrame(applyTranslations);
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  const nextIntlMessages = useMemo(() => getNextIntlMessages(language), [language]);

  const contextValue = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      translate,
    }),
    [language, setLanguage, translate]
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
