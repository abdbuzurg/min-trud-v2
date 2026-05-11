import { createTranslator } from "next-intl";
import translations from "./translations.ru.json";
import { AppLanguage } from "./types";

type TranslationTarget = Exclude<AppLanguage, "ru">;
type TranslationEntry = Record<TranslationTarget, string>;
type TranslationDictionary = Record<string, TranslationEntry>;

const dictionary = translations as TranslationDictionary;
const sortedEntries = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);
const hasCyrillicRegex = /[А-Яа-яЁё]/;

const sourceToKey = new Map<string, string>();
for (let index = 0; index < sortedEntries.length; index += 1) {
  sourceToKey.set(sortedEntries[index][0], `m${index.toString(36)}`);
}

const translationCache = new Map<string, string>();
const localeMessagesCache = new Map<AppLanguage, Record<string, string>>();
const localeTranslatorCache = new Map<
  AppLanguage,
  ReturnType<typeof createTranslator<{ catalog: Record<string, string> }, "catalog">>
>();

const preserveEdgeWhitespace = (source: string, translatedCore: string): string => {
  const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) {
    return translatedCore;
  }

  return `${match[1]}${translatedCore}${match[3]}`;
};

const buildLocaleMessages = (language: AppLanguage): Record<string, string> => {
  const cached = localeMessagesCache.get(language);
  if (cached) {
    return cached;
  }

  const messages: Record<string, string> = {};
  for (const [ruText, translated] of sortedEntries) {
    const messageKey = sourceToKey.get(ruText);
    if (!messageKey) {
      continue;
    }

    messages[messageKey] = language === "ru" ? ruText : translated[language];
  }

  localeMessagesCache.set(language, messages);
  return messages;
};

const getLocaleTranslator = (language: AppLanguage) => {
  const cached = localeTranslatorCache.get(language);
  if (cached) {
    return cached;
  }

  const translator = createTranslator({
    locale: language,
    messages: {
      catalog: buildLocaleMessages(language),
    },
    namespace: "catalog",
  });

  localeTranslatorCache.set(language, translator);
  return translator;
};

export const getNextIntlMessages = (language: AppLanguage): { catalog: Record<string, string> } => {
  return {
    catalog: buildLocaleMessages(language),
  };
};

const translateExactCore = (sourceCore: string, language: AppLanguage): string | null => {
  const messageKey = sourceToKey.get(sourceCore);
  if (!messageKey) {
    return null;
  }

  return getLocaleTranslator(language)(messageKey);
};

export const translateRuText = (source: string, language: AppLanguage): string => {
  if (language === "ru") {
    return source;
  }

  if (!source) {
    return source;
  }

  const cacheKey = `${language}::${source}`;
  const cached = translationCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) {
    translationCache.set(cacheKey, source);
    return source;
  }

  const originalCore = match[2];
  if (!originalCore || !hasCyrillicRegex.test(originalCore)) {
    translationCache.set(cacheKey, source);
    return source;
  }

  const exact = translateExactCore(originalCore, language);
  if (exact) {
    const exactResult = preserveEdgeWhitespace(source, exact);
    translationCache.set(cacheKey, exactResult);
    return exactResult;
  }

  let translatedCore = originalCore;

  for (const [ruText] of sortedEntries) {
    if (!translatedCore.includes(ruText)) {
      continue;
    }

    const replacement = translateExactCore(ruText, language);
    if (!replacement) {
      continue;
    }
    translatedCore = translatedCore.split(ruText).join(replacement);
  }

  const result = preserveEdgeWhitespace(source, translatedCore);
  translationCache.set(cacheKey, result);
  return result;
};
