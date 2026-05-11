import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  APP_LANGUAGES,
  APP_LANGUAGE_COOKIE_KEY,
  AppLanguage,
  DEFAULT_APP_LANGUAGE,
} from "./types";
import { getNextIntlMessages } from "./translate";

const isAppLanguage = (value: string): value is AppLanguage => {
  return (APP_LANGUAGES as readonly string[]).includes(value);
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(APP_LANGUAGE_COOKIE_KEY)?.value ?? "";
  const locale = isAppLanguage(cookieLocale) ? cookieLocale : DEFAULT_APP_LANGUAGE;

  return {
    locale,
    messages: getNextIntlMessages(locale),
  };
});
