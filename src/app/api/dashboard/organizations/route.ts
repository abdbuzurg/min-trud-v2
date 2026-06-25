import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { withApiLogging } from "@/lib/withApiLogging";
import { parseOrganizationInput } from "@/lib/organizationValidation";

function isAuthorized(request: NextRequest): boolean {
  return Boolean(request.cookies.get("session")?.value);
}

async function getOrganizations(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const organizations = await prisma.organization.findMany({
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  return NextResponse.json({ data: organizations }, { status: 200 });
}

async function postOrganization(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const parsed = parseOrganizationInput(await request.json());
  if ("errors" in parsed) {
    return NextResponse.json({ tag: "VALIDATION", errors: parsed.errors }, { status: 400 });
  }

  const maxPosition = await prisma.organization.aggregate({
    _max: { position: true },
  });

  const organization = await prisma.organization.create({
    data: {
      ...parsed.data,
      position: (maxPosition._max.position ?? 0) + 1,
    },
  });

  return NextResponse.json({ data: organization }, { status: 201 });
}

export const GET = withApiLogging("api.dashboard.organizations.get", getOrganizations);
export const POST = withApiLogging("api.dashboard.organizations.post", postOrganization);
