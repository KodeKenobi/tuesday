const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      password: hashedPassword,
      name: "John Smith",
      role: "USER",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      email: "sarah@example.com",
      password: hashedPassword,
      name: "Sarah Johnson",
      role: "USER",
    },
  });

  // Create clients
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

  // Create tickets with new fields
  const tickets = [
    {
      title: "Website Redesign - Homepage",
      description:
        "Complete redesign of the homepage with modern UI/UX principles. Focus on improving conversion rates and user engagement.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      estimatedHours: 16.0,
      tags: JSON.stringify(["design", "frontend", "homepage"]),
      creatorId: user1.id,
      assigneeId: user2.id,
      clientId: client1.id,
    },
    {
      title: "Mobile App Development",
      description:
        "Develop a cross-platform mobile application for iOS and Android using React Native. Include user authentication and real-time features.",
      priority: "URGENT",
      status: "BACKLOG",
      estimatedHours: 80.0,
      tags: JSON.stringify(["mobile", "react-native", "development"]),
      creatorId: user1.id,
      assigneeId: user3.id,
      clientId: client2.id,
    },
    {
      title: "Database Optimization",
      description:
        "Optimize existing database queries and implement indexing strategies to improve application performance.",
      priority: "MEDIUM",
      status: "CLIENT_REVIEW",
      estimatedHours: 12.0,
      tags: JSON.stringify(["database", "optimization", "performance"]),
      creatorId: user2.id,
      assigneeId: user1.id,
      clientId: client3.id,
    },
    {
      title: "API Integration",
      description:
        "Integrate third-party payment processing API and implement secure transaction handling.",
      priority: "HIGH",
      status: "REVISIONS",
      estimatedHours: 24.0,
      tags: JSON.stringify(["api", "payment", "integration"]),
      creatorId: user3.id,
      assigneeId: user2.id,
      clientId: client4.id,
    },
    {
      title: "Security Audit",
      description:
        "Conduct comprehensive security audit of the application and implement necessary security measures.",
      priority: "URGENT",
      status: "IN_PROGRESS",
      estimatedHours: 20.0,
      tags: JSON.stringify(["security", "audit", "compliance"]),
      creatorId: user1.id,
      assigneeId: user3.id,
      clientId: client5.id,
    },
    {
      title: "Content Management System",
      description:
        "Build a custom CMS for managing website content with user-friendly admin interface.",
      priority: "MEDIUM",
      status: "COMPLETE",
      estimatedHours: 40.0,
      tags: JSON.stringify(["cms", "admin", "content"]),
      creatorId: user2.id,
      assigneeId: user1.id,
      clientId: client1.id,
    },
    {
      title: "Email Marketing Campaign",
      description:
        "Design and implement automated email marketing campaigns with analytics tracking.",
      priority: "LOW",
      status: "BACKLOG",
      estimatedHours: 8.0,
      tags: JSON.stringify(["email", "marketing", "automation"]),
      creatorId: user3.id,
      assigneeId: user2.id,
      clientId: client2.id,
    },
    {
      title: "Performance Monitoring",
      description:
        "Set up comprehensive performance monitoring and alerting system for production environment.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      estimatedHours: 16.0,
      tags: JSON.stringify(["monitoring", "performance", "alerts"]),
      creatorId: user1.id,
      assigneeId: user3.id,
      clientId: client3.id,
    },
    {
      title: "User Authentication System",
      description:
        "Implement secure user authentication with OAuth, JWT tokens, and role-based access control.",
      priority: "URGENT",
      status: "CLIENT_REVIEW",
      estimatedHours: 32.0,
      tags: JSON.stringify(["auth", "security", "oauth"]),
      creatorId: user2.id,
      assigneeId: user1.id,
      clientId: client4.id,
    },
    {
      title: "Data Migration",
      description:
        "Migrate legacy data to new database schema with data validation and rollback procedures.",
      priority: "MEDIUM",
      status: "REVISIONS",
      estimatedHours: 28.0,
      tags: JSON.stringify(["migration", "data", "validation"]),
      creatorId: user3.id,
      assigneeId: user2.id,
      clientId: client5.id,
    },
    {
      title: "Frontend Component Library",
      description:
        "Create a reusable component library with comprehensive documentation and examples.",
      priority: "LOW",
      status: "COMPLETE",
      estimatedHours: 36.0,
      tags: JSON.stringify(["components", "library", "documentation"]),
      creatorId: user1.id,
      assigneeId: user3.id,
      clientId: client1.id,
    },
    {
      title: "Backup System Implementation",
      description:
        "Implement automated backup system with cloud storage integration and disaster recovery procedures.",
      priority: "HIGH",
      status: "BACKLOG",
      estimatedHours: 20.0,
      tags: JSON.stringify(["backup", "cloud", "disaster-recovery"]),
      creatorId: user2.id,
      assigneeId: user1.id,
      clientId: client2.id,
    },
    {
      title: "SEO Optimization",
      description:
        "Optimize website for search engines with meta tags, structured data, and performance improvements.",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      estimatedHours: 12.0,
      tags: JSON.stringify(["seo", "optimization", "meta-tags"]),
      creatorId: user3.id,
      assigneeId: user2.id,
      clientId: client3.id,
    },
    {
      title: "Load Testing",
      description:
        "Conduct comprehensive load testing to ensure application can handle expected traffic volumes.",
      priority: "HIGH",
      status: "CLIENT_REVIEW",
      estimatedHours: 16.0,
      tags: JSON.stringify(["testing", "load", "performance"]),
      creatorId: user1.id,
      assigneeId: user3.id,
      clientId: client4.id,
    },
    {
      title: "Documentation Update",
      description:
        "Update technical documentation and create user guides for new features.",
      priority: "LOW",
      status: "COMPLETE",
      estimatedHours: 8.0,
      tags: JSON.stringify(["documentation", "guides", "technical"]),
      creatorId: user2.id,
      assigneeId: user1.id,
      clientId: client5.id,
    },
  ];

  for (const ticketData of tickets) {
    await prisma.ticket.upsert({
      where: {
        id: `ticket-${ticketData.title.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: ticketData,
      create: {
        ...ticketData,
        id: `ticket-${ticketData.title.toLowerCase().replace(/\s+/g, "-")}`,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${tickets.length} tickets`);
  console.log("Test user: admin@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
