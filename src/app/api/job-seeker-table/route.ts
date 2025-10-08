import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

const pageSize = 10
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateStart = searchParams.get("dateStart")
  const dateEnd = searchParams.get("dateEnd")
  const page = searchParams.get("page")
  const firstName = searchParams.get("firstName")
  const lastName = searchParams.get("lastName")
  if (!page) {
    return NextResponse.json({ message: "invalid page indication" }, { status: 400 })
  }

  console.log(dateStart, dateEnd)

  const count = await prisma.jobSeeker.count({
    where: {
      createdAt: {
        gte: dateStart ? new Date(dateStart) : undefined,
        lte: dateEnd ? new Date(dateEnd) : undefined,
      },
      firstName: {
        contains: firstName ? firstName : undefined,
        mode: 'insensitive'
      },
      lastName: {
        contains: lastName ? lastName : undefined,
        mode: 'insensitive'
      },
    }
  })
  const count1C = await prisma.jobSeeker.count({
    where: {
      syncedWith1C: true,
      createdAt: {
        gte: dateStart ? new Date(dateStart) : undefined,
        lte: dateEnd ? new Date(dateEnd) : undefined,
      },
      firstName: {
        contains: firstName ? firstName : undefined,
        mode: 'insensitive'
      },
      lastName: {
        contains: lastName ? lastName : undefined,
        mode: 'insensitive'
      },
    }
  })
  let result

  result = await prisma.jobSeeker.findMany({
    skip: (+page - 1) * pageSize,
    take: pageSize,
    include: {
      additionalContactInformation: true,
      knowledgeOfLanguages: true,
      WorkExperience: true,
      education: true,
    },
    where: {
      createdAt: {
        gte: dateStart ? new Date(dateStart) : undefined,
        lte: dateEnd ? new Date(dateEnd) : undefined,
      },
      firstName: {
        contains: firstName ? firstName : undefined,
        mode: 'insensitive'
      },
      lastName: {
        contains: lastName ? lastName : undefined,
        mode: 'insensitive'
      },
    },
    orderBy: {
      id: 'desc',
    }
  })


  return NextResponse.json({ data: result, count: count, count1C: count1C }, { status: 200 })
} 
