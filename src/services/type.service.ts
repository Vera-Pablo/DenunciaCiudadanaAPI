import { typeRepository } from "../repositories/type.repository.js";

class TypeService {
  async getAllTypes() {
    return await typeRepository.getAll();
  }

  async getTypeById(id: number) {
    const type = await typeRepository.getById(id);
    if (!type) {
      throw new Error("Tipo de denuncia no encontrado");
    }
    return type;
  }

  async createType(type: string) {
    const existing = await typeRepository.getByType(type);
    if (existing) {
      throw new Error("El tipo de denuncia ya existe");
    }
    return await typeRepository.create({ type });
  }

  async updateType(id: number, type: string) {
    await this.getTypeById(id);
    return await typeRepository.update(id, { type });
  }

  async deleteType(id: number) {
    await this.getTypeById(id);
    return await typeRepository.delete(id);
  }
}

export const typeService = new TypeService();
