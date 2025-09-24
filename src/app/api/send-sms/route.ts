import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import crypto from 'crypto'
import axios from "axios";

function generateVerificationCode(): string {
  // The minimum value is 100000 (a 6-digit number).
  // The maximum value is 999999 (the largest 6-digit number).
  // crypto.randomInt is exclusive of the max value, so we use 1,000,000.
  const min = 100_000;
  const max = 1_000_000;

  const code = randomInt(min, max);

  // Convert the number to a string to ensure it's always 6 digits.
  // This is technically redundant given the min/max range, but it's good practice.
  return code.toString();
}

function generateSha256Hash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let { phoneNumber } = body

    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.substring(1)
    }

    //checking if current number is registered as user
    let user = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber
      }
    })

    // if not we create user using the number
    if (!user) {
      user = await prisma.user.create({
        data: {
          phoneNumber: phoneNumber
        }
      })
    }

    // the code will be one time password for each entry
    const code = generateVerificationCode()
    await prisma.sendSMS.create({
      data: {
        userId: user.id,
        code: code,
      }
    })

    // const smsCount = await prisma.sendSMS.count()
    // const txn_id: number = 2730 + smsCount
    // const from = "MuhojiratTj"
    // const msg = `Код - ${code}`
    // const login = "mehnattj"
    // const hash = "e129257bd2607968f0502161132638c2"
    // const hashContent = `${txn_id};${login};${from};${phoneNumber};${hash}`
    // const str_hash = generateSha256Hash(hashContent)
    // const url = `https://api.osonsms.com/sendsms_v1.php?from=${from}&msg=${msg}&login=${login}&str_hash=${str_hash}&phone_number=${phoneNumber}&txn_id=${txn_id}`
    // const smsResponse = await axios.get(url)
    // if (smsResponse.status != 201) {
    //   return NextResponse.json({ message: "Ошибка при генерации смс" }, { status: 500 })
    // }

    return NextResponse.json({ message: "Успех" }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 })
  }
}
