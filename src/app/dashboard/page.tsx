import { Metadata } from "next";
import DashboardUpdated from "./components/DashboardUpdated";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Админ панель",
}

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")
  if (!token) {
    redirect("/login")
  }

  return (
    <DashboardUpdated />
  )
}
