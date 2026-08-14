import type { Action } from "routing-controllers";
import { authConfig } from "../env.js";
import jwt from "jsonwebtoken";
import { userService } from "../services/UserService.js";

export async function authorizationChecker(action: Action): Promise<boolean> {
  const authHeader = action.request.headers.authorization;
  if (!authHeader) {
    return false;
  }
  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, authConfig.jwtSecretKey) as {
      userId: string;
    };
    const user = await userService.findOne({
      where: { id: payload.userId, isActive: true },
    });
    if (!user) {
      return false;
    }
    action.request.userId = user.id;
    return true;
  } catch {
    return false;
  }
}
