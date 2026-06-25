import { Phone } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import Logos from "../components/logos";
import { translateRuText } from "@/i18n/translate";
import { getServerLanguage } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  return {
    title: translateRuText("Соискатели работы", language),
  };
}

export default async function Seeker() {
  const language = await getServerLanguage();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-y-5">
      <div className="flex flex-col gap-y-2 rounded-3xl border border-green-100 bg-white p-4 shadow-xl shadow-green-100 sm:p-8">
        <div className="m-auto flex w-full flex-col gap-3 rounded-md bg-white px-3 py-3 text-center sm:flex-row sm:gap-5 sm:px-4 sm:py-5">
          <Link
            href="/job-seeker-profile"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-green-300 sm:text-base"
          >{translateRuText("Соискатель работы", language)}</Link>
          <Link
            href="#"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-green-300 sm:text-base"
          >{translateRuText("Работодатель", language)}</Link>
        </div>
      </div>
      <Logos />
    </div>
  );
}
