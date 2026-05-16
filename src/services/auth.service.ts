import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { roleRepository } from "../repositories/role.repository.js";
import { userService } from "./user.service.js";
import { UserMapper } from "../utils/user.mapper.js";
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "../schemas/auth.schema.js";
import { emailService } from "./email.service.js";

class AuthService {
  async register(data: RegisterInput) {
    const roles = await roleRepository.getAll();
    const citizenRoleObj = roles.find((r) => r.type_role === "Ciudadano");

    if (!citizenRoleObj) {
      throw new Error("Rol por defecto 'Ciudadano' no encontrado");
    }

    return await userService.createUser({
      ...data,
      id_role: citizenRoleObj.id_role,
    });
  }

  async login(data: LoginInput) {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
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

  async requestPasswordReset(data: ForgotPasswordInput){
    const user = await userRepository.getByEmail(data.email);
    
    if(!user) return;

    const secretkey = (process.env.JWT_SECRET || "default_secret") + user.password;

    const token = jwt.sign(
      { id_user: user.id_user, email: user.email },
      secretkey,
      { expiresIn: "15m" }
    );

    await emailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(data: ResetPasswordInput){
    const {token, newPassword} = data;

    const decoded = jwt.decode(token) as {id_user: number} | null;
    if(!decoded || !decoded.id_user){
      throw new Error("Token de recuperación inválido");
    }

    const user = await userRepository.getById(decoded.id_user);
    if(!user){
      throw new Error("Usuario no encontrado");
    }

    const secretKey = (process.env.JWT_SECRET || "default_secret") + user.password;
    try {
      jwt.verify(token, secretKey);
    } catch (error){
      throw new Error("El enlace ha expirado o ya ha sido utilizado.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(user.id_user, {password: hashedPassword} as any);
  }
}

export const authService = new AuthService();
