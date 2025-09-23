import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import { JobSeekerFromData } from "../../../../types/jobSeeker"
import { createToken } from "@/app/secret"

export async function POST(request: NextRequest) {

  try {
    const body = await request.json()

    let { code, phoneNumber } = body

    const user = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      }
    })
    if (!user) {
      return NextResponse.json({ message: "Ваш номер не существует в базе для проверки кода, попробуйте еще раз" }, { status: 401 })
    }

    const sendSms = await prisma.sendSMS.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: 'desc'
      }
    })
    if (!sendSms) {
      return NextResponse.json({ message: "На ваш номер не было отправлено сообщение, попробуйте еще раз." }, { status: 401 })
    }

    if (sendSms.code != code) {
      return NextResponse.json({ message: "Неправильный код" }, { status: 401 })
    }

    const jobSeekerData = await prisma.jobSeeker.findFirst({
      where: {
        userId: user.id,
      }
    })
    if (!jobSeekerData) {
      return NextResponse.json({ token: null, status: "Успех" }, { status: 200 })
    }


    return NextResponse.json({ token: createToken(phoneNumber), status: "Успех" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Ошибка проверки кода" }, { status: 501 })
  }
}
