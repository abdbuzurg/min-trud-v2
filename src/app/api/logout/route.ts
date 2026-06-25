import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { withApiLogging } from "@/lib/withApiLogging";

async function postLogout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: false,
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ message: "success" }, { status: 200 });
}

export const POST = withApiLogging("api.logout.post", postLogout);
