import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
export function signJwt(payload: Record<string, any>, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch {
    return null;
  }
}