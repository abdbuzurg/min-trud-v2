import { Metadata } from "next";
import JobSeekerProfileView from "./components/JobSeekerProfileView";
import { translateRuText } from "@/i18n/translate";
import { getServerLanguage } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  return {
    title: translateRuText("Профиль соискателя работы", language),
  };
}

export default function JobSeekerProfile() {
  return <JobSeekerProfileView />
}
