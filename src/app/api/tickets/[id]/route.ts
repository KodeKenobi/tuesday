import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Get the ticket to check permissions
    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // If user is a client, they can only update tickets assigned to them
    if (user.role === "CLIENT") {
      if (ticket.clientId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Clients can only set status to COMPLETE or REVISIONS
      if (status !== "COMPLETE" && status !== "REVISIONS") {
        return NextResponse.json(
          {
            error:
              "Clients can only mark tickets as complete or request revisions",
          },
          { status: 400 }
        );
      }
    }

    const updatedTicket = await db.ticket.update({
      where: { id },
      data: { status },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
