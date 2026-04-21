import { prisma } from "../config/db.js";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "../schemas/user.schema.js";

class UserRepository {
  async getAll() {
    return await prisma.user.findMany({
      include: { role: true },
    });
  }

  async getById(id: number) {
    return await prisma.user.findUnique({
      where: { id_user: id },
      include: { role: true },
    });
  }

  async getByDni(dni: number) {
    return await prisma.user.findUnique({
      where: { dni },
      include: { role: true },
    });
  }

  async getByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async create(data: CreateUserInput) {
    return await prisma.user.create({
      data: {
        ...data,
        is_active: true,
      },
      include: { role: true },
    });
  }

  async update(id: number, data: UpdateUserInput) {
    return await prisma.user.update({
      where: { id_user: id },
      data: data as any,
      include: { role: true },
    });
  }
}

export const userRepository = new UserRepository();
