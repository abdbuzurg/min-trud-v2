import { redirect } from "next/navigation";
import AdminEditJobSeeker from "./components/AdminEditJobSeeker";
import { cookies } from "next/headers";

export default async function EditJobSeeker(
  { params }: { params: Promise<{ phoneNumber: string }> }
) {

  const { phoneNumber } = await params;

  const cookieStore = await cookies()
  const token = cookieStore.get("session")
  if (!token) {
    redirect("/login")
  }

  return <AdminEditJobSeeker phoneNumber={phoneNumber} />
}
