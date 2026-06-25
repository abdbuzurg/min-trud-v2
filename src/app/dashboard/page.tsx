import { Metadata } from "next";
import DashboardUpdated from "./components/DashboardUpdated";

export const metadata: Metadata = {
  title: "Админ панель",
}

export default function Dashboard() {
  return (
    <DashboardUpdated />
  )
}
