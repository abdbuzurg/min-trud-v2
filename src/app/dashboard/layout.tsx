import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "./components/AdminNav";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session");
  if (!token) {
    redirect("/login");
  }

  return (
    // Admin area is Russian-only: nothing here goes through translate()
    <div className="min-h-screen w-full bg-[#F2FFF4]">
      <AdminNav />
      {children}
    </div>
  );
}
