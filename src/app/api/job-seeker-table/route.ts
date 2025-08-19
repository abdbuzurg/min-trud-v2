import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

const pageSize = 10
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateStart = searchParams.get("dateStart")
  const dateEnd = searchParams.get("dateEnd")
  const page = searchParams.get("page")
  if (!page) {
    return NextResponse.json({ message: "invalid page indication" }, { status: 400 })
  }

  const count = await prisma.jobSeeker.count()
  let result
  if (!dateStart && !dateEnd) {
    result = await prisma.jobSeeker.findMany({
      skip: (+page - 1) * pageSize,
      take: pageSize,
      include: {
        additionalContactInformation: true,
        knowledgeOfLanguages: true,
        WorkExperience: true,
      }
    })

  }

  if (!dateStart && dateEnd) {
    result = await prisma.jobSeeker.findMany({
      skip: (+page - 1) * pageSize,
      take: pageSize,
      include: {
        additionalContactInformation: true,
        knowledgeOfLanguages: true,
        WorkExperience: true,
      },
      where: {
        createdAt: {
          lte: new Date(dateEnd)
        }
      }
    })

  }

  if (dateStart && !dateEnd) {
    result = await prisma.jobSeeker.findMany({
      skip: (+page - 1) * pageSize,
      take: pageSize,
      include: {
        additionalContactInformation: true,
        knowledgeOfLanguages: true,
        WorkExperience: true,
      },
      where: {
        createdAt: {
          gte: new Date(dateStart)
        }
      }
    })

  }

  if (dateStart && dateEnd) {
    result = await prisma.jobSeeker.findMany({
      skip: (+page - 1) * pageSize,
      take: pageSize,
      include: {
        additionalContactInformation: true,
        knowledgeOfLanguages: true,
        WorkExperience: true,
      },
      where: {
        createdAt: {
          gte: new Date(dateStart),
          lte: new Date(dateEnd)
        }
      }
    })
  }


  return NextResponse.json({ data: result, count: count }, { status: 200 })
} 
