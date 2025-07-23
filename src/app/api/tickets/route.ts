import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    const where: Record<string, string | { clientId: string }> = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    // If user is a client, only show their tickets
    if (user.role === "CLIENT") {
      where.clientId = user.id;
    }

    const tickets = await db.ticket.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Parse tags from JSON string to array
    const ticketsWithParsedTags = tickets.map((ticket) => ({
      ...ticket,
      tags: ticket.tags ? JSON.parse(ticket.tags) : [],
    }));

    return NextResponse.json(ticketsWithParsedTags);
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      priority,
      status = "BACKLOG",
      assignee,
      client,
      estimatedHours,
      tags,
      clientId,
      assigneeId,
    } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Convert tags array to JSON string for storage
    const tagsString = tags && tags.length > 0 ? JSON.stringify(tags) : null;

    // Handle assignee - if it's a string name, create a new user
    let finalAssigneeId = assigneeId;
    if (assignee && !assigneeId) {
      try {
        // Create a new user with the provided name
        const newUser = await db.user.create({
          data: {
            name: assignee,
            email: `${assignee.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            password: await bcrypt.hash("temp123", 10), // Temporary password
            role: "USER",
          },
        });
        finalAssigneeId = newUser.id;
      } catch (error) {
        console.error("Error creating assignee user:", error);
      }
    }

    // Handle client - if it's a string name, create a new client
    let finalClientId = clientId;
    if (client && !clientId) {
      try {
        // Create a new client with the provided name
        const newClient = await db.client.create({
          data: {
            name: client,
            email: `${client.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            isInvited: false,
          },
        });
        finalClientId = newClient.id;
      } catch (error) {
        console.error("Error creating client:", error);
      }
    }

    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        status,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        tags: tagsString,
        creatorId: user.id,
        clientId: finalClientId || null,
        assigneeId: finalAssigneeId || null,
      },
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

    // Parse tags for response
    const ticketWithParsedTags = {
      ...ticket,
      tags: ticket.tags ? JSON.parse(ticket.tags) : [],
    };

    return NextResponse.json(ticketWithParsedTags);
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
