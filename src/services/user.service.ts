import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { UserMapper } from "../utils/user.mapper.js";
import type { CreateUserInput, UpdateUserInput } from "../schemas/user.schema.js";

class UserService {
  async getAllUsers() {
    const users = await userRepository.getAll();
    return UserMapper.toSanitizedUser(users);
  }

  async getUserById(id: number) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return UserMapper.toSanitizedUser(user);
  }

  async createUser(data: CreateUserInput) {
    const existingDni = await userRepository.getByDni(data.dni);
    if (existingDni) {
      throw new Error("El DNI ya está registrado");
    }

    const existingEmail = await userRepository.getByEmail(data.email);
    if (existingEmail) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const role = await roleRepository.getById(data.id_role);
    if (!role) {
      throw new Error("El rol proporcionado no existe");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return UserMapper.toSanitizedUser(newUser);
  }

  async updateUser(id: number, data: UpdateUserInput) {
    const existingUser = await userRepository.getById(id);
    if (!existingUser) throw new Error("Usuario no encontrado");

    if (data.dni && data.dni !== existingUser.dni) {
      const duplicateDni = await userRepository.getByDni(data.dni);
      if (duplicateDni) throw new Error("El DNI ya está registrado");
    }

    if (data.email && data.email !== existingUser.email) {
      const duplicateEmail = await userRepository.getByEmail(data.email);
      if (duplicateEmail) throw new Error("El correo electrónico ya está registrado");
    }

    if (data.id_role) {
      const role = await roleRepository.getById(data.id_role);
      if (!role) throw new Error("El rol proporcionado no existe");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await userRepository.update(id, data);
    return UserMapper.toSanitizedUser(updatedUser);
  }
}

export const userService = new UserService();
