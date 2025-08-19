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

function generateSha256Hash(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let { phoneNumber } = body

    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.substring(1)
    }

    let sendSms = await prisma.sendSMS.findFirst({
      where: {
        phoneNumber: phoneNumber,
      }
    })
    let txn_id: number
    if (!sendSms) {
      sendSms = await prisma.sendSMS.create({
        data: {
          phoneNumber: phoneNumber,
          txn_id: 1000,
        }
      })

      txn_id = 1000
    } else {
      txn_id = sendSms.txn_id + 1
    }
    await prisma.sendSMS.update({
      where: {
        phoneNumber: phoneNumber,
        id: sendSms.id,
      },
      data: {
        txn_id: txn_id + 1
      }
    })

    const code = generateVerificationCode()
    const from = "OsonSMS"
    const msg = `Код - ${code}`
    const login = "sparrow"
    const hash = "367e04ea47a0c53f13a840ef74f8ad62"
    const hashContent = `${txn_id};${login};${from};${phoneNumber};${hash}`
    const str_hash = generateSha256Hash(hashContent)
    const url = `https://api.osonsms.com/sendsms_v1.php?from=${from}&msg=${msg}&login=${login}&str_hash=${str_hash}&phone_number=${phoneNumber}&txn_id=${txn_id}`
    await axios.get(url)

    return NextResponse.json({ code: code }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ code: "error sending sms" }, { status: 500 })
  }
}