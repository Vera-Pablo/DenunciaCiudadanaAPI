import { prisma } from "../config/db.js";

class TypeRepository {
  async getAll() {
    return await prisma.type.findMany();
  }

  async getById(id: number) {
    return await prisma.type.findUnique({
      where: { id_type: id },
    });
  }

  async getByType(type: string) {
    return await prisma.type.findUnique({
      where: { type: type },
    });
  }

  async create(data: { type: string }) {
    return await prisma.type.create({
      data,
    });
  }

  async update(id: number, data: { type: string }) {
    return await prisma.type.update({
      where: { id_type: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.type.delete({
      where: { id_type: id },
    });
  }
}

export const typeRepository = new TypeRepository();
