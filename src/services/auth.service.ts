import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import type { LoginInput } from "../schemas/auth.schema.js";

class AuthService {
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

    const { password, ...sanitizedUser } = user;
    return { user: sanitizedUser, token };
  }
}

export const authService = new AuthService();
