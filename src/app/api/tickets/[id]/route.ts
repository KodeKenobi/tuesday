import { NextRequest, NextResponse } from "next/server";
import { Role, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import {
  canAccessTeam,
  getClientRecordForUser,
  getUserWithTeamAccess,
} from "@/lib/access";
import { writeAuditLog } from "@/lib/audit";

const ticketInclude = {
  creator: { select: { id: true, name: true, email: true } },
  assignee: { select: { id: true, name: true, email: true } },
  client: { select: { id: true, name: true, email: true } },
  team: { select: { id: true, name: true } },
  project: { select: { id: true, name: true, health: true, progress: true } },
} satisfies Prisma.TicketInclude;

async function loadTicketForAuth(id: string) {
  return db.ticket.findUnique({
    where: { id },
    include: { team: true },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const sessionUser = await getUserFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithTeamAccess(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await loadTicketForAuth(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    let updates = (await request.json()) as Record<string, unknown>;

    if (user.role === Role.CLIENT) {
      const client = await getClientRecordForUser(user);
      if (!client || ticket.clientId !== client.id) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      if (ticket.status !== "CLIENT_REVIEW") {
        return NextResponse.json(
          { error: "Clients can only update tickets in Client Review status" },
          { status: 400 },
        );
      }

      const newStatus = updates.status as string | undefined;
      if (!newStatus || !["COMPLETE", "REVISIONS"].includes(newStatus)) {
        return NextResponse.json(
          {
            error:
              "Clients can only mark tickets as Complete or request Revisions",
          },
          { status: 400 },
        );
      }
      updates = { status: newStatus };
    } else {
      if (ticket.teamId && !canAccessTeam(user, ticket.teamId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const allowed: Record<string, unknown> = {};
      if (typeof updates.title === "string") {
        allowed.title = updates.title.trim();
      }
      if (typeof updates.description === "string") {
        allowed.description = updates.description;
      }
      if (
        typeof updates.status === "string" &&
        [
          "BACKLOG",
          "IN_PROGRESS",
          "REVISIONS",
          "CLIENT_REVIEW",
          "COMPLETE",
        ].includes(updates.status)
      ) {
        allowed.status = updates.status;
      }
      if (updates.assigneeId === null || updates.assigneeId === "") {
        allowed.assigneeId = null;
      } else if (typeof updates.assigneeId === "string") {
        allowed.assigneeId = updates.assigneeId;
      }
      if (typeof updates.projectId === "string") {
        const proj = await db.project.findUnique({
          where: { id: updates.projectId },
        });
        if (
          !proj ||
          (ticket.teamId && proj.teamId !== ticket.teamId) ||
          (!ticket.teamId && proj.teamId)
        ) {
          return NextResponse.json(
            { error: "Invalid project for this ticket" },
            { status: 400 },
          );
        }
        allowed.projectId = updates.projectId;
      }
      if (updates.projectId === null) {
        allowed.projectId = null;
      }

      updates = allowed;
      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
      }

      if (updates.assigneeId && typeof updates.assigneeId === "string") {
        const assignee = await getUserWithTeamAccess(updates.assigneeId);
        if (!assignee || assignee.role === Role.CLIENT) {
          return NextResponse.json({ error: "Invalid assignee" }, { status: 400 });
        }
        if (ticket.teamId) {
          const ok =
            assignee.role === Role.SUPER_ADMIN ||
            canAccessTeam(assignee, ticket.teamId);
          if (!ok) {
            return NextResponse.json(
              { error: "Assignee must belong to the ticket team" },
              { status: 400 },
            );
          }
        }
      }
    }

    const updatedTicket = await db.ticket.update({
      where: { id },
      data: updates as Prisma.TicketUpdateInput,
      include: ticketInclude,
    });

    await writeAuditLog({
      actorId: user.id,
      action: "TICKET_UPDATE",
      entityType: "Ticket",
      entityId: id,
      metadata: updates as Record<string, unknown>,
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
      return NextResponse.json(
        { error: "Clients cannot delete tickets" },
        { status: 403 },
      );
    }

    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.teamId && !canAccessTeam(user, ticket.teamId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const canDelete =
      user.role === Role.SUPER_ADMIN || ticket.creatorId === user.id;

    if (!canDelete) {
      return NextResponse.json(
        { error: "Only the creator or a super admin can delete this ticket" },
        { status: 403 },
      );
    }

    await db.ticket.delete({ where: { id } });

    await writeAuditLog({
      actorId: user.id,
      action: "TICKET_DELETE",
      entityType: "Ticket",
      entityId: id,
      metadata: { title: ticket.title },
    });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
