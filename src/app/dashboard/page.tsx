import { Metadata } from "next";
import DashboardView from "./components/DashboardView";

export const metadata: Metadata = {
  title: "Админ панель",
}

export default async function Dashboard() {

  return (
    <body>
      <div className="h-16 bg-[#98FF78] w-full px-6 py-2 flex">
        <div className="h-full flex items-center">
          <p className="font-bold text-2xl">Министерство Труда</p>
        </div>
      </div>
      <DashboardView />
    </body >
  )
}
