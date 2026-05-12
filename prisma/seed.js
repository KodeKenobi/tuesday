const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding enterprise data…");

  await prisma.auditLog.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.savedView.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.teamMembership.deleteMany();

  await prisma.organizationSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ssoEnabled: false },
    update: {},
  });

  const devTeam = await prisma.team.upsert({
    where: { name: "Development" },
    update: {},
    create: { name: "Development" },
  });

  const salesTeam = await prisma.team.upsert({
    where: { name: "Sales" },
    update: {},
    create: { name: "Sales" },
  });

  const marketingTeam = await prisma.team.upsert({
    where: { name: "Marketing" },
    update: {},
    create: { name: "Marketing" },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: { role: "SUPER_ADMIN" },
    create: {
      email: "superadmin@example.com",
      password: hashedPassword,
      name: "Department Head",
      role: "SUPER_ADMIN",
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { teamId: devTeam.id },
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "USER",
      teamId: devTeam.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: { teamId: devTeam.id },
    create: {
      email: "john@example.com",
      password: hashedPassword,
      name: "John Smith",
      role: "USER",
      teamId: devTeam.id,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: { teamId: salesTeam.id },
    create: {
      email: "sarah@example.com",
      password: hashedPassword,
      name: "Sarah Johnson",
      role: "USER",
      teamId: salesTeam.id,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {
      teamId: devTeam.id,
      role: "USER",
    },
    create: {
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      role: "USER",
      teamId: devTeam.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "acme@example.com" },
    update: { role: "CLIENT" },
    create: {
      email: "acme@example.com",
      password: hashedPassword,
      name: "Acme Portal User",
      role: "CLIENT",
    },
  });

  await prisma.teamMembership.createMany({
    data: [
      { userId: user1.id, teamId: devTeam.id },
      { userId: user2.id, teamId: devTeam.id },
      { userId: user3.id, teamId: salesTeam.id },
      { userId: testUser.id, teamId: devTeam.id },
      { userId: superAdmin.id, teamId: devTeam.id },
      { userId: superAdmin.id, teamId: salesTeam.id },
      { userId: superAdmin.id, teamId: marketingTeam.id },
    ],
  });

  const client1 = await prisma.client.upsert({
    where: { email: "acme@example.com" },
    update: {},
    create: {
      name: "Acme Corporation",
      email: "acme@example.com",
      isInvited: true,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "techstart@example.com" },
    update: {},
    create: {
      name: "TechStart Inc",
      email: "techstart@example.com",
      isInvited: true,
    },
  });

  const client3 = await prisma.client.upsert({
    where: { email: "designhub@example.com" },
    update: {},
    create: {
      name: "DesignHub Studio",
      email: "designhub@example.com",
      isInvited: true,
    },
  });

  const client4 = await prisma.client.upsert({
    where: { email: "innovate@example.com" },
    update: {},
    create: {
      name: "Innovate Solutions",
      email: "innovate@example.com",
      isInvited: true,
    },
  });

  const client5 = await prisma.client.upsert({
    where: { email: "global@example.com" },
    update: {},
    create: {
      name: "Global Enterprises",
      email: "global@example.com",
      isInvited: true,
    },
  });

  const portfolio = await prisma.portfolio.create({
    data: {
      name: "2026 Company Delivery",
      description: "Portfolio for heads-of-department overview",
    },
  });

  const projDev = await prisma.project.create({
    data: {
      name: "Acme Digital Platform",
      description: "End-to-end delivery for Acme",
      teamId: devTeam.id,
      portfolioId: portfolio.id,
      clientId: client1.id,
      status: "ACTIVE",
      health: "GREEN",
      progress: 42,
    },
  });

  const projSales = await prisma.project.create({
    data: {
      name: "Enterprise Pipeline",
      teamId: salesTeam.id,
      portfolioId: portfolio.id,
      clientId: client5.id,
      status: "ACTIVE",
      health: "AMBER",
      progress: 60,
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        projectId: projDev.id,
        title: "Design sign-off",
        sortOrder: 0,
        completedAt: new Date(),
      },
      {
        projectId: projDev.id,
        title: "Production launch",
        sortOrder: 1,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        projectId: projSales.id,
        title: "Q2 revenue target",
        sortOrder: 0,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    ],
  });

  await prisma.automationRule.create({
    data: {
      name: "Auto-notify on client review",
      teamId: devTeam.id,
      trigger: JSON.stringify({ type: "ticket.status", to: "CLIENT_REVIEW" }),
      action: JSON.stringify({ type: "notify", channel: "email" }),
      enabled: true,
    },
  });

  const ticketRows = [
    {
      title: "Website Redesign - Homepage",
      status: "IN_PROGRESS",
      creatorId: user1.id,
      assigneeId: user2.id,
      clientId: client1.id,
      teamId: devTeam.id,
      projectId: projDev.id,
    },
    {
      title: "Mobile App Development",
      status: "BACKLOG",
      creatorId: user1.id,
      assigneeId: user3.id,
      clientId: client2.id,
      teamId: devTeam.id,
      projectId: projDev.id,
    },
    {
      title: "Database Optimization",
      status: "CLIENT_REVIEW",
      creatorId: user2.id,
      assigneeId: user1.id,
      clientId: client3.id,
      teamId: devTeam.id,
    },
    {
      title: "API Integration",
      status: "REVISIONS",
      creatorId: user1.id,
      assigneeId: user2.id,
      clientId: client4.id,
      teamId: devTeam.id,
    },
    {
      title: "Sales Presentation",
      status: "COMPLETE",
      creatorId: user3.id,
      assigneeId: user3.id,
      clientId: client5.id,
      teamId: salesTeam.id,
      projectId: projSales.id,
    },
    {
      title: "Client Onboarding",
      status: "IN_PROGRESS",
      creatorId: user3.id,
      clientId: client1.id,
      teamId: salesTeam.id,
    },
    {
      title: "Marketing Campaign",
      status: "BACKLOG",
      creatorId: user3.id,
      clientId: client2.id,
      teamId: salesTeam.id,
    },
    {
      title: "Contract Review",
      status: "CLIENT_REVIEW",
      creatorId: user1.id,
      clientId: client3.id,
      teamId: salesTeam.id,
    },
    {
      title: "Product Demo",
      status: "COMPLETE",
      creatorId: user2.id,
      clientId: client4.id,
      teamId: devTeam.id,
    },
    {
      title: "Bug Fixes",
      status: "IN_PROGRESS",
      creatorId: user2.id,
      clientId: client5.id,
      teamId: devTeam.id,
    },
    {
      title: "Feature Request",
      status: "BACKLOG",
      creatorId: user1.id,
      clientId: client1.id,
      teamId: devTeam.id,
    },
    {
      title: "Security Audit",
      status: "REVISIONS",
      creatorId: user3.id,
      clientId: client2.id,
      teamId: salesTeam.id,
    },
    {
      title: "Performance Testing",
      status: "IN_PROGRESS",
      creatorId: user2.id,
      clientId: client3.id,
      teamId: devTeam.id,
    },
    {
      title: "User Training",
      status: "COMPLETE",
      creatorId: user3.id,
      clientId: client4.id,
      teamId: salesTeam.id,
    },
    {
      title: "System Update",
      status: "BACKLOG",
      creatorId: user1.id,
      clientId: client5.id,
      teamId: devTeam.id,
    },
  ];

  for (const t of ticketRows) {
    const slug = t.title.toLowerCase().replace(/\s+/g, "-");
    await prisma.ticket.create({
      data: {
        id: `ticket-${slug}`,
        ...t,
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log("Super admin: superadmin@example.com / password123");
  console.log("Employee: admin@example.com / password123");
  console.log("Test user: test@example.com / password123 (Development team)");
  console.log("Client portal user: acme@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
