export class UserMapper {
  static toSanitizedUser<T extends Record<string, any>>(
    user: T,
  ): Omit<T, "password">;
  static toSanitizedUser<T extends Record<string, any>>(
    users: T[],
  ): Omit<T, "password">[];
  static toSanitizedUser(data: any): any {
    if (Array.isArray(data)) {
      return data.map((user) => this.sanitize(user));
    }
    return this.sanitize(data);
  }

  private static sanitize(user: any) {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
