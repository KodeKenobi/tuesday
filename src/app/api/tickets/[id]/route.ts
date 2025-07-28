import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updates = await request.json();

    if (user.role === "CLIENT") {
      const client = await db.client.findFirst({
        where: { email: user.email },
      });

      if (!client) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 }
        );
      }

      const ticket = await db.ticket.findFirst({
        where: { id, clientId: client.id },
      });

      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket not found" },
          { status: 404 }
        );
      }

      if (ticket.status !== "CLIENT_REVIEW") {
        return NextResponse.json(
          { error: "Clients can only update tickets in Client Review status" },
          { status: 400 }
        );
      }

      if (!["COMPLETE", "REVISIONS"].includes(updates.status)) {
        return NextResponse.json(
          {
            error:
              "Clients can only mark tickets as Complete or request Revisions",
          },
          { status: 400 }
        );
      }

      const allowedUpdates = { status: updates.status };
      if (!allowedUpdates.status) {
        return NextResponse.json(
          { error: "Status is required" },
          { status: 400 }
        );
      }
      updates = allowedUpdates;
    }

    const updatedTicket = await db.ticket.update({
      where: { id },
      data: updates,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "CLIENT") {
      return NextResponse.json(
        { error: "Clients cannot delete tickets" },
        { status: 403 }
      );
    }

    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        creator: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.creatorId !== user.id && user.role !== "USER") {
      return NextResponse.json(
        { error: "You can only delete tickets you created" },
        { status: 403 }
      );
    }

    await db.ticket.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
