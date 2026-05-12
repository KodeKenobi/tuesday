import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session || session.role === Role.CLIENT) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db.portfolio.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { projects: true } },
      },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Portfolios GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session || session.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : undefined;
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const portfolio = await db.portfolio.create({
      data: { name, description },
    });

    await writeAuditLog({
      actorId: session.id,
      action: "PORTFOLIO_CREATE",
      entityType: "Portfolio",
      entityId: portfolio.id,
      metadata: { name },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Portfolios POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
