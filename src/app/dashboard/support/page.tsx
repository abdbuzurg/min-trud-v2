import { Metadata } from "next";
import SupportOrganizations from "./components/SupportOrganizations";

export const metadata: Metadata = {
  title: "Поддержка",
};

export default function SupportPage() {
  return <SupportOrganizations />;
}
