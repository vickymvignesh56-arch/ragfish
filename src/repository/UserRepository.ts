import { User } from "../model/user.js";
import { AppDataSource } from "../config/database.js";
import type { UserRequest } from "../dto/user/UserRequest.js";
import type { UpdateUserRequest } from "../dto/user/UpdateUserRequest.js";

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

  async update(user: User, updateData: UpdateUserRequest) {
    Object.assign(user, updateData);
    return await this.repository.save(user);
  }
}

export const userRepository = new UserRepository();
