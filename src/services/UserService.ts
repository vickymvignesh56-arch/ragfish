import type { UserRequest } from "../dto/user/UserRequest.js";
import type { User } from "../model/user.js";
import {
  UserRepository,
  userRepository,
} from "../repository/UserRepository.js";
import { hashPassword } from "../utils/bcrypt.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: UserRequest): Promise<User | null> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      return null;
    }
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    return this.userRepository.createUser(user);
  }
}

export const userService = new UserService(userRepository);
