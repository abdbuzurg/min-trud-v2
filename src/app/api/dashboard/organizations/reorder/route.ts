import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { withApiLogging } from "@/lib/withApiLogging";

function isAuthorized(request: NextRequest): boolean {
  return Boolean(request.cookies.get("session")?.value);
}

async function postReorder(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids : null;
  if (!ids || ids.length === 0 || !ids.every((id) => Number.isInteger(id) && id > 0)) {
    return NextResponse.json({ message: "ids must be a list of organization ids" }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id: number, index: number) =>
      prisma.organization.update({
        where: { id },
        data: { position: index + 1 },
      })
    )
  );

  const organizations = await prisma.organization.findMany({
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  return NextResponse.json({ data: organizations }, { status: 200 });
}

export const POST = withApiLogging("api.dashboard.organizations.reorder.post", postReorder);
