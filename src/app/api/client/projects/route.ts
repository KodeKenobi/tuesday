import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { getClientRecordForUser, getUserWithTeamAccess } from "@/lib/access";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(session.id);
    if (!user || user.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await getClientRecordForUser(user);
    if (!client) {
      return NextResponse.json([]);
    }

    const projects = await db.project.findMany({
      where: {
        OR: [{ clientId: client.id }, { tickets: { some: { clientId: client.id } } }],
      },
      include: {
        team: { select: { id: true, name: true } },
        _count: { select: { milestones: true, tickets: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Client projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
