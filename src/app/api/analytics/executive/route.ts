import { NextRequest, NextResponse } from "next/server";
import { Role, TicketStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  x.setDate(diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function weekKey(d: Date) {
  const s = startOfWeek(d);
  return s.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session || session.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [ticketsByStatus, projectsByHealth, projectsByStatus, openTickets] =
      await Promise.all([
        db.ticket.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        db.project.groupBy({
          by: ["health"],
          _count: { _all: true },
        }),
        db.project.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        db.ticket.count({
          where: { status: { not: TicketStatus.COMPLETE } },
        }),
      ]);

    const since = new Date();
    since.setDate(since.getDate() - 56);

    const completedTickets = await db.ticket.findMany({
      where: {
        status: TicketStatus.COMPLETE,
        updatedAt: { gte: since },
      },
      select: { updatedAt: true },
    });

    const weekly: Record<string, number> = {};
    for (const t of completedTickets) {
      const k = weekKey(t.updatedAt);
      weekly[k] = (weekly[k] ?? 0) + 1;
    }

    const keys = Object.keys(weekly).sort();
    const completedPerWeek = keys.map((k) => ({ week: k, count: weekly[k] }));

    const teams = await db.team.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { tickets: true } },
      },
    });

    return NextResponse.json({
      ticketsByStatus: ticketsByStatus.map((r) => ({
        status: r.status,
        count: r._count._all,
      })),
      projectsByHealth: projectsByHealth.map((r) => ({
        health: r.health,
        count: r._count._all,
      })),
      projectsByStatus: projectsByStatus.map((r) => ({
        status: r.status,
        count: r._count._all,
      })),
      openTickets,
      completedPerWeek,
      teams,
    });
  } catch (error) {
    console.error("Executive analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
