import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/TokenPayload";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh";

class TokenService {
  generateTokens(payload: object) {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string) {
    try {
      return jwt.verify(token, ACCESS_SECRET);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        REFRESH_SECRET
      ) as unknown as TokenPayload;

      if (
        typeof decoded === "object" &&
        decoded &&
        "id" in decoded &&
        "email" in decoded
      ) {
        return decoded;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
