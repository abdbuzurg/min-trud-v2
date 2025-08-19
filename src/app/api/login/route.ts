import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"


const adminEmail = "superadmin@mintrud.tj"
const adminPassword = "mintrud2025"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === adminEmail && password === adminPassword) {
      const cookieStore = await cookies()
      cookieStore.set('session', 'user-authenticated', {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      })

      return NextResponse.json({ message: "success" }, { status: 200 })
    }

    return NextResponse.json({ message: "invalid credentials" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Error while logging in" }, { status: 500 })
  }
}
