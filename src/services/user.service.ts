import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import type { CreateUserInput, UpdateUserInput } from "../schemas/user.schema.js";

class UserService {
  async getAllUsers() {
    return await userRepository.getAll();
  }

  async getUserById(id: number) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(data: CreateUserInput) {
    const existingDni = await userRepository.getByDni(data.dni);
    if (existingDni) {
      throw new Error("DNI already exists");
    }

    const existingEmail = await userRepository.getByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const role = await roleRepository.getById(data.id_role);
    if (!role) {
      throw new Error("Provided role does not exist");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async updateUser(id: number, data: UpdateUserInput) {
    const existingUser = await this.getUserById(id);

    if (data.dni && data.dni !== existingUser.dni) {
      const duplicateDni = await userRepository.getByDni(data.dni);
      if (duplicateDni) throw new Error("DNI already exists");
    }

    if (data.email && data.email !== existingUser.email) {
      const duplicateEmail = await userRepository.getByEmail(data.email);
      if (duplicateEmail) throw new Error("Email already exists");
    }

    if (data.id_role) {
      const role = await roleRepository.getById(data.id_role);
      if (!role) throw new Error("Provided role does not exist");
    }

    // Hash password if it's being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await userRepository.update(id, data);
  }
}

export const userService = new UserService();
