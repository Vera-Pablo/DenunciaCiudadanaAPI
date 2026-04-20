import { prisma } from "../config/db.js";

class RoleRepository {
  async getAll() {
    return await prisma.role.findMany();
  }

  async getById(id: number) {
    return await prisma.role.findUnique({
      where: { id_role: id },
    });
  }

  async getByType(type: string) {
    return await prisma.role.findUnique({
      where: { type_role: type },
    });
  }

  async create(data: { type_role: string }) {
    return await prisma.role.create({
      data,
    });
  }

  async update(id: number, data: { type_role: string }) {
    return await prisma.role.update({
      where: { id_role: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.role.delete({
      where: { id_role: id },
    });
  }
}

export const roleRepository = new RoleRepository();
