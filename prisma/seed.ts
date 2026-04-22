import { prisma } from "../src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  const roles = ["Ciudadano", "Autoridad"];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { type_role: role },
      update: {},
      create: { type_role: role },
    });
  }

  const statuses = ["Pendiente", "Rechazado", "Atendido", "Finalizado"];
  for (const status of statuses) {
    await prisma.status.upsert({
      where: { type_status: status },
      update: {},
      create: { type_status: status },
    });
  }

  const types = [
    "Vandalismo",
    "Alumbrado Público",
    "Residuos",
    "Seguridad",
    "Otros",
  ];
  for (const type of types) {
    await prisma.type.upsert({
      where: { type: type },
      update: {},
      create: { type: type },
    });
  }

  const authorityRole = await prisma.role.findUnique({
    where: { type_role: "Autoridad" },
  });

  if (authorityRole) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@denuncia.com" },
      update: {},
      create: {
        dni: 12345678,
        email: "admin@denuncia.com",
        password: hashedPassword,
        name: "Admin de Ciudad",
        telefono: "0000000000",
        is_active: true,
        id_role: authorityRole.id_role,
      },
    });
    console.log("Authority user created: admin@denuncia.com / admin123");
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
