import { BadRequestError } from "routing-controllers";
import type { UserRequest } from "../dto/user/UserRequest.js";
import type { User } from "../model/user.js";
import {
  UserRepository,
  userRepository,
} from "../repository/UserRepository.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { mailService } from "./MailService.js";
import { qdrantServices } from "../services/QdrantService.js";
import type { UpdateUserRequest } from "../dto/user/UpdateUserRequest.js";

export type LoginRequest = {
  email: string;
  password: string;
};

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  findOne(condition: any): Promise<User | null> {
    return this.userRepository.findOne(condition);
  }

  findByUserId(userId: string) {
    return this.userRepository.findById(userId);
  }
  async registerUser(user: UserRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      user.email.toString().toLowerCase(),
    );
    if (existingUser) {
      throw new BadRequestError("email already exits");
    }
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    const createUser = await this.userRepository.createUser(user);
    await mailService.sendMail(createUser.email, createUser.name);
    await qdrantServices.createQdrantCollection(createUser.id);
    return createUser;
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

  async userDetails(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  async updateProfile(userId: string, userRequest: UpdateUserRequest) {
    const users = await this.userRepository.findById(userId);
    if (!users) {
      return null;
    }
    const updateDate = {
      ...userRequest,
    };
    if (updateDate.password) {
      updateDate.password = await hashPassword(updateDate.password);
    }
    return await this.userRepository.update(users, updateDate);
  }
}

export const userService = new UserService(userRepository);
