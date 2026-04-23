import { statusRepository } from "../repositories/status.repository.js";

class StatusService {
  async getAllStatuses() {
    return await statusRepository.getAll();
  }

  async getStatusById(id: number) {
    const status = await statusRepository.getById(id);
    if (!status) {
      throw new Error("Estado no encontrado");
    }
    return status;
  }

  async createStatus(type_status: string) {
    const existing = await statusRepository.getByType(type_status);
    if (existing) {
      throw new Error("El tipo de estado ya existe");
    }
    return await statusRepository.create({ type_status });
  }

  async updateStatus(id: number, type_status: string) {
    await this.getStatusById(id);
    return await statusRepository.update(id, { type_status });
  }

  async deleteStatus(id: number) {
    await this.getStatusById(id);
    return await statusRepository.delete(id);
  }
}

export const statusService = new StatusService();
