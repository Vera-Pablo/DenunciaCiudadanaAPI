import { prisma } from "../src/config/db.js";

async function clean() {
  console.log("Cleaning database...");

  await prisma.comment.deleteMany();
  console.log("  ✓ Comments deleted");

  await prisma.report.deleteMany();
  console.log("  ✓ Reports deleted");

  console.log("Cleaning finished — catalog tables and admin user preserved.");
}

clean()
  .catch((e) => {
    console.error("Cleaning failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
