import { NextRequest, NextResponse } from "next/server";
import {
  ProjectHealth,
  ProjectStatus,
  Role,
} from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { canAccessTeam, getUserWithTeamAccess } from "@/lib/access";
import { writeAuditLog } from "@/lib/audit";

const projectInclude = {
  team: { select: { id: true, name: true } },
  portfolio: { select: { id: true, name: true } },
  client: { select: { id: true, name: true, email: true } },
  milestones: { orderBy: { sortOrder: "asc" as const } },
  _count: { select: { tickets: true } },
} as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const session = await getUserFromRequest(_request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(session.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await db.project.findUnique({
      where: { id },
      include: projectInclude,
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (user.role === Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (user.role === Role.USER && !canAccessTeam(user, project.teamId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(session.id);
    if (!user || user.role === Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!canAccessTeam(user, existing.teamId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data: {
      name?: string;
      description?: string;
      progress?: number;
      health?: ProjectHealth;
      status?: ProjectStatus;
      portfolioId?: string | null;
      clientId?: string | null;
    } = {};

    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.description === "string") data.description = body.description;
    if (typeof body.progress === "number") {
      data.progress = Math.min(100, Math.max(0, body.progress));
    }
    if (
      typeof body.health === "string" &&
      (Object.values(ProjectHealth) as string[]).includes(body.health)
    ) {
      data.health = body.health as ProjectHealth;
    }
    if (
      typeof body.status === "string" &&
      (Object.values(ProjectStatus) as string[]).includes(body.status)
    ) {
      data.status = body.status as ProjectStatus;
    }
    if (body.portfolioId === null) data.portfolioId = null;
    if (typeof body.portfolioId === "string") data.portfolioId = body.portfolioId;
    if (body.clientId === null) data.clientId = null;
    if (typeof body.clientId === "string") data.clientId = body.clientId;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    const project = await db.project.update({
      where: { id },
      data,
      include: projectInclude,
    });

    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_UPDATE",
      entityType: "Project",
      entityId: id,
      metadata: data,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
