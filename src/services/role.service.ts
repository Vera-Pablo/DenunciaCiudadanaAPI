import { roleRepository } from "../repositories/role.repository.js";

class RoleService {
  async getAllRoles() {
    return await roleRepository.getAll();
  }

  async getRoleById(id: number) {
    const role = await roleRepository.getById(id);
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  }

  async createRole(type_role: string) {
    const existing = await roleRepository.getByType(type_role);
    if (existing) {
      throw new Error("Role type already exists");
    }
    return await roleRepository.create({ type_role });
  }

  async updateRole(id: number, type_role: string) {
    await this.getRoleById(id);
    return await roleRepository.update(id, { type_role });
  }

  async deleteRole(id: number) {
    await this.getRoleById(id);
    return await roleRepository.delete(id);
  }
}

export const roleService = new RoleService();
