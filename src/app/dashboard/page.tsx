import { Metadata } from "next";
import DashboardUpdated from "./components/DashboardUpdated";

export const metadata: Metadata = {
  title: "Админ панель",
}

export default async function Dashboard() {

  return (
    <body>
      <DashboardUpdated />
    </body >
  )
}
