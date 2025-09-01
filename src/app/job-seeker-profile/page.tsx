import { Metadata } from "next";
import JobSeekerProfileView from "./components/JobSeekerProfileView";

export const metadata: Metadata = {
  title: "Профиль соискателя работы",
}

export default function JobSeekerProfile() {
  return <JobSeekerProfileView />
}
