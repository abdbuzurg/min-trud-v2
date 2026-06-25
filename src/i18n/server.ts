import { cookies } from "next/headers";
import {
  APP_LANGUAGES,
  APP_LANGUAGE_COOKIE_KEY,
  AppLanguage,
  DEFAULT_APP_LANGUAGE,
} from "./types";

export async function getServerLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const rawLanguage = cookieStore.get(APP_LANGUAGE_COOKIE_KEY)?.value ?? "";
  return (APP_LANGUAGES as readonly string[]).includes(rawLanguage)
    ? (rawLanguage as AppLanguage)
    : DEFAULT_APP_LANGUAGE;
}

export function toHtmlLang(language: AppLanguage): string {
  return language === "tj" ? "tg" : language;
}
