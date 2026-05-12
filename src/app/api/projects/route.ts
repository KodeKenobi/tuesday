import { NextRequest, NextResponse } from "next/server";
import { Prisma, ProjectHealth, ProjectStatus, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { canAccessTeam, getUserWithTeamAccess } from "@/lib/access";
import { writeAuditLog } from "@/lib/audit";

const projectInclude = {
  team: { select: { id: true, name: true } },
  portfolio: { select: { id: true, name: true } },
  client: { select: { id: true, name: true, email: true } },
  _count: { select: { milestones: true, tickets: true } },
} as const;

export async function GET(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(session.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const portfolioId = searchParams.get("portfolioId");

    if (user.role === Role.CLIENT) {
      return NextResponse.json([]);
    }

    const where: Prisma.ProjectWhereInput = {};

    if (portfolioId) {
      where.portfolioId = portfolioId;
    }

    if (user.role === Role.SUPER_ADMIN) {
      if (teamId) where.teamId = teamId;
    } else if (user.role === Role.USER) {
      if (!teamId) {
        return NextResponse.json(
          { error: "teamId is required" },
          { status: 400 },
        );
      }
      if (!canAccessTeam(user, teamId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      where.teamId = teamId;
    }

    const projects = await db.project.findMany({
      where,
      include: projectInclude,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(session.id);
    if (!user || user.role === Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const teamIdIn = typeof body.teamId === "string" ? body.teamId : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : undefined;
    const portfolioId =
      typeof body.portfolioId === "string" ? body.portfolioId : undefined;
    const clientId =
      typeof body.clientId === "string" ? body.clientId : undefined;

    if (!name || !teamIdIn) {
      return NextResponse.json(
        { error: "name and teamId are required" },
        { status: 400 },
      );
    }

    if (!canAccessTeam(user, teamIdIn)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const health =
      typeof body.health === "string" &&
      (Object.values(ProjectHealth) as string[]).includes(body.health)
        ? (body.health as ProjectHealth)
        : undefined;
    const status =
      typeof body.status === "string" &&
      (Object.values(ProjectStatus) as string[]).includes(body.status)
        ? (body.status as ProjectStatus)
        : undefined;

    const project = await db.project.create({
      data: {
        name,
        description,
        teamId: teamIdIn,
        portfolioId,
        clientId,
        progress: typeof body.progress === "number" ? body.progress : 0,
        health,
        status,
      },
      include: projectInclude,
    });

    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_CREATE",
      entityType: "Project",
      entityId: project.id,
      metadata: { name, teamId: teamIdIn },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
