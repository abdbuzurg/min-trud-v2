import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { translateRuText } from "@/i18n/translate";
import { getServerLanguage, toHtmlLang } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();

  return {
    title: translateRuText("Министерство Труда", language),
    description: translateRuText("Платформа для работы с соискателями", language),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getServerLanguage();

  return (
    <html lang={toHtmlLang(language)}>
      <body className="flex min-h-screen flex-col items-stretch bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-4 sm:px-4 sm:py-8">
        <LanguageProvider initialLanguage={language}>
          <LanguageSwitcher />
          <div className="flex w-full grow flex-col justify-center">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
