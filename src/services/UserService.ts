import type { UserRequest } from "../dto/user/UserRequest.js";
import type { User } from "../model/user.js";
import {
  UserRepository,
  userRepository,
} from "../repository/UserRepository.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

export type LoginRequest = {
  email: string;
  password: string;
};

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  findOne(condition: any): Promise<User | null> {
    return this.userRepository.findOne(condition);
  }
  async registerUser(user: UserRequest): Promise<User | null> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      return null;
    }
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    return this.userRepository.createUser(user);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.verifyCredential(email, password);
    return user;
  }

  async verifyCredential(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const compare = await comparePassword(password, user.password);
    if (!compare) {
      return null;
    }
    return user;
  }
}

export const userService = new UserService(userRepository);
