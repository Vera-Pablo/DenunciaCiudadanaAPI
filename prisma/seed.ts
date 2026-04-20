import { prisma } from "../src/config/db.js";

async function main() {
  console.log("Seeding database...");

  // Seed Roles
  const roles = ["citizen", "authority"];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { type_role: role },
      update: {},
      create: { type_role: role },
    });
  }

  // Seed Statuses
  const statuses = ["pending", "rejected", "attended", "completed"];
  for (const status of statuses) {
    await prisma.status.upsert({
      where: { type_status: status },
      update: {},
      create: { type_status: status },
    });
  }

  // Seed Types
  const types = ["Vandalismo", "Alumbrado Público", "Residuos", "Seguridad", "Otros"];
  for (const type of types) {
    await prisma.type.upsert({
      where: { type: type },
      update: {},
      create: { type: type },
    });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
