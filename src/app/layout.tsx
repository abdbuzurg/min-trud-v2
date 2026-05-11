import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "./components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Министерство Труда",
  description: "Платформа для работы с соискателями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col items-stretch bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-4 sm:px-4 sm:py-8">
        <LanguageProvider>
          <LanguageSwitcher />
          <div className="flex w-full grow flex-col justify-center">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
