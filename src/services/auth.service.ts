import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { userService } from "./user.service.js";
import { UserMapper } from "../utils/user.mapper.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";

class AuthService {
  async register(data: RegisterInput) {
    const roles = await roleRepository.getAll();
    const citizenRoleObj = roles.find((r) => r.type_role === "citizen");

    if (!citizenRoleObj) {
      throw new Error("Default role 'citizen' not found in database");
    }

    return await userService.createUser({
      ...data,
      id_role: citizenRoleObj.id_role,
    });
  }

  async login(data: LoginInput) {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const secret =
      process.env.JWT_SECRET || "default_secret_key_change_me_in_env";
    const token = jwt.sign(
      {
        id_user: user.id_user,
        role: user.role.type_role,
      },
      secret,
      { expiresIn: "7d" },
    );

    return {
      user: UserMapper.toSanitizedUser(user),
      token,
    };
  }
}

export const authService = new AuthService();
