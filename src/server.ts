import { prisma } from "./config/db.js";
import { createServer } from "node:http";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);

server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Conexión a la BD establecida!");
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.log("Error al contectar con la DB:", err);
  } finally {
    prisma.$disconnect();
  }
});
