import { User } from "../model/user.js";
import { AppDataSource } from "../config/database.js";
import type { UserRequest } from "../dto/user/UserRequest.js";

export class UserRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  findOne(condition: any): Promise<User | null> {
    return this.repository.findOne(condition);
  }
  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  createUser(user: UserRequest): Promise<User> {
    const newUser = this.repository.create({
      name: user.name,
      email: user.email.toString().toLowerCase(),
      password: user.password,
      isActive: user.isActive,
    });
    return this.repository.save(newUser);
  }
}

export const userRepository = new UserRepository();
