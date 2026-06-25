import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { withApiLogging } from "@/lib/withApiLogging";
import { parseOrganizationInput } from "@/lib/organizationValidation";

type RouteContext = { params: Promise<{ id: string }> };

function isAuthorized(request: NextRequest): boolean {
  return Boolean(request.cookies.get("session")?.value);
}

async function resolveId(context: RouteContext): Promise<number | null> {
  const { id } = await context.params;
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function putOrganization(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const id = await resolveId(context);
  if (!id) {
    return NextResponse.json({ message: "invalid id" }, { status: 400 });
  }

  const parsed = parseOrganizationInput(await request.json());
  if ("errors" in parsed) {
    return NextResponse.json({ tag: "VALIDATION", errors: parsed.errors }, { status: 400 });
  }

  const existing = await prisma.organization.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ data: organization }, { status: 200 });
}

async function deleteOrganization(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const id = await resolveId(context);
  if (!id) {
    return NextResponse.json({ message: "invalid id" }, { status: 400 });
  }

  const existing = await prisma.organization.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  await prisma.organization.delete({ where: { id } });

  return NextResponse.json({ message: "success" }, { status: 200 });
}

export const PUT = withApiLogging("api.dashboard.organizations.put", putOrganization);
export const DELETE = withApiLogging("api.dashboard.organizations.delete", deleteOrganization);
