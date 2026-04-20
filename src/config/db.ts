import dotenv from "dotenv";
dotenv.config();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
});

const env = envSchema.parse(process.env);

const connectionString = env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
