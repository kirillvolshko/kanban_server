import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import TokenService from "./token.service";

class UserService {
  async registration(name: string, email: string, password: string) {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw { status: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const tokens = TokenService.generateTokens({
      id: user.id,
      email: user.email,
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 400, message: "Wrong password" };
    }

    const tokens = TokenService.generateTokens({
      id: user.id,
      email: user.email,
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async logout() {
    return { message: "User logged out" };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw { status: 401, message: "No refresh token provided" };
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    if (!userData || typeof userData === "string") {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const user = await prisma.users.findUnique({ where: { id: userData.id } });
    if (!user) {
      throw { status: 401, message: "User not found" };
    }

    const tokens = TokenService.generateTokens({
      id: user.id,
      email: user.email,
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }
}

export default new UserService();
