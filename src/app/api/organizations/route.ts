import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { withApiLogging } from "@/lib/withApiLogging";

async function getOrganizations() {
  const organizations = await prisma.organization.findMany({
    orderBy: [{ position: "asc" }, { id: "asc" }],
    select: {
      id: true,
      nameRu: true,
      nameEn: true,
      nameTj: true,
      phone: true,
      email: true,
    },
  });

  return NextResponse.json({ data: organizations }, { status: 200 });
}

export const GET = withApiLogging("api.organizations.get", getOrganizations);
