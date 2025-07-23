import { PrismaClient } from "@prisma/client";
import { mockTickets, mockUsers, mockClients } from "../lib/mockData";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
    await prisma.client.deleteMany();

    // Create users with properly hashed passwords
    console.log("👥 Creating users...");
    const createdUsers = await Promise.all(
      mockUsers.map(async (user) => {
        const hashedPassword = await hashPassword("password123");
        return prisma.user.create({
          data: {
            ...user,
            password: hashedPassword,
          },
        });
      })
    );

    // Create a test user account for easy login
    console.log("🔑 Creating test user account...");
    const testUserPassword = await hashPassword("test123");
    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: testUserPassword,
        name: "Test User",
        role: "USER",
      },
    });

    // Create clients
    console.log("🏢 Creating clients...");
    const createdClients = await Promise.all(
      mockClients.map((client) =>
        prisma.client.create({
          data: client,
        })
      )
    );

    // Create tickets
    console.log("🎫 Creating tickets...");
    const tickets = await Promise.all(
      mockTickets.map(async (ticket) => {
        const creator =
          createdUsers.find((user) => user.name === ticket.assigneeName) ||
          createdUsers[0];
        const assignee =
          createdUsers.find((user) => user.name === ticket.assigneeName) ||
          createdUsers[0];
        const client =
          createdClients.find((c) => c.name === ticket.clientName) ||
          createdClients[0];

        return prisma.ticket.create({
          data: {
            title: ticket.title,
            status: ticket.status as any,
            creatorId: creator.id,
            assigneeId: assignee.id,
            clientId: client.id,
            createdAt: ticket.createdAt,
          },
        });
      })
    );

    console.log(`✅ Successfully seeded database with:`);
    console.log(`   - ${createdUsers.length + 1} users (including test user)`);
    console.log(`   - ${createdClients.length} clients`);
    console.log(`   - ${tickets.length} tickets`);
    console.log(`\n🔑 Test Login Credentials:`);
    console.log(`   Email: test@example.com`);
    console.log(`   Password: test123`);
    console.log(`\n👥 Other User Accounts (all with password: password123):`);
    createdUsers.forEach((user) => {
      console.log(`   ${user.email} (${user.name})`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedDatabase();
