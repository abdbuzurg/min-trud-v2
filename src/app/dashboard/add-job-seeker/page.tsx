import { cookies } from "next/headers";
import AdminJobSeekerForm from "./components/AdminJobSeekerForm";
import { redirect } from "next/navigation";

export default async function AddJobSeeker() {

  const cookieStore = await cookies()
  const token = cookieStore.get("session")
  if (!token) {
    redirect("/login")
  }

  return <AdminJobSeekerForm />
}
