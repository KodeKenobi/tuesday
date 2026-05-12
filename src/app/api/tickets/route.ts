import { NextRequest, NextResponse } from "next/server";
import { Role, Prisma, TicketStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import {
  canAccessTeam,
  getClientRecordForUser,
  getUserWithTeamAccess,
  teamIdsForUser,
} from "@/lib/access";
import { writeAuditLog } from "@/lib/audit";

const ticketInclude = {
  creator: { select: { id: true, name: true, email: true } },
  assignee: { select: { id: true, name: true, email: true } },
  client: { select: { id: true, name: true, email: true } },
  team: { select: { id: true, name: true } },
  project: { select: { id: true, name: true, health: true, progress: true } },
} satisfies Prisma.TicketInclude;

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getUserFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const teamIdParam = searchParams.get("teamId");
    const projectId = searchParams.get("projectId");
    const assigneeId = searchParams.get("assigneeId");
    const myWorkload = searchParams.get("myWorkload") === "1";

    const where: Prisma.TicketWhereInput = {};

    if (
      status &&
      (Object.values(TicketStatus) as string[]).includes(status)
    ) {
      where.status = status as TicketStatus;
    }
    if (clientId) {
      where.clientId = clientId;
    }
    if (projectId) {
      where.projectId = projectId;
    }

    if (user.role === Role.CLIENT) {
      const client = await getClientRecordForUser(user);
      if (!client) {
        return NextResponse.json([]);
      }
      where.clientId = client.id;
    } else if (user.role === Role.USER) {
      const allowedTeams = teamIdsForUser(user) ?? [];
      if (myWorkload) {
        where.assigneeId = user.id;
        if (allowedTeams.length === 0) {
          return NextResponse.json([]);
        }
        where.teamId = { in: allowedTeams };
      } else {
        if (!teamIdParam) {
          return NextResponse.json(
            { error: "teamId is required to view team tickets" },
            { status: 400 },
          );
        }
        if (!canAccessTeam(user, teamIdParam)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        where.teamId = teamIdParam;
        if (assigneeId) {
          where.assigneeId = assigneeId;
        }
      }
    } else if (user.role === Role.SUPER_ADMIN) {
      if (myWorkload) {
        where.assigneeId = user.id;
      } else if (teamIdParam) {
        where.teamId = teamIdParam;
      }
      if (assigneeId) {
        where.assigneeId = assigneeId;
      }
    }

    const tickets = await db.ticket.findMany({
      where,
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getUserFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const status = body.status ?? "BACKLOG";
    const clientIdIn = body.clientId ?? null;
    const teamIdIn = typeof body.teamId === "string" ? body.teamId : null;
    const projectIdIn = typeof body.projectId === "string" ? body.projectId : null;
    const description =
      typeof body.description === "string" ? body.description.trim() : undefined;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!teamIdIn) {
      return NextResponse.json(
        { error: "teamId is required for new tickets" },
        { status: 400 },
      );
    }

    if (!canAccessTeam(user, teamIdIn)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let finalClientId: string | null = null;
    if (clientIdIn) {
      const client = await db.client.findUnique({ where: { id: clientIdIn } });
      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 400 });
      }
      if (!client.isInvited) {
        return NextResponse.json(
          { error: "Only invited clients can be assigned to tickets" },
          { status: 400 },
        );
      }
      finalClientId = clientIdIn;
    }

    if (projectIdIn) {
      const project = await db.project.findUnique({ where: { id: projectIdIn } });
      if (!project || project.teamId !== teamIdIn) {
        return NextResponse.json(
          { error: "Project not found for this team" },
          { status: 400 },
        );
      }
    }

    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        status,
        creatorId: user.id,
        clientId: finalClientId,
        teamId: teamIdIn,
        projectId: projectIdIn,
      },
      include: ticketInclude,
    });

    await writeAuditLog({
      actorId: user.id,
      action: "TICKET_CREATE",
      entityType: "Ticket",
      entityId: ticket.id,
      metadata: { title: ticket.title, teamId: teamIdIn },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
