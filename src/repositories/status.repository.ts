import { prisma } from "../config/db.js";

class StatusRepository {
  async getAll() {
    return await prisma.status.findMany();
  }

  async getById(id: number) {
    return await prisma.status.findUnique({
      where: { id_status: id },
    });
  }

  async getByType(type: string) {
    return await prisma.status.findUnique({
      where: { type_status: type },
    });
  }

  async create(data: { type_status: string }) {
    return await prisma.status.create({
      data,
    });
  }

  async update(id: number, data: { type_status: string }) {
    return await prisma.status.update({
      where: { id_status: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.status.delete({
      where: { id_status: id },
    });
  }
}

export const statusRepository = new StatusRepository();
