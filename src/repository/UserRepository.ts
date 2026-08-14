import { User } from "../model/user.js";
import { AppDataSource } from "../config/database.js";
import type { UserRequest } from "../dto/user/UserRequest.js";

const repository = AppDataSource.getRepository(User);
export class UserRepository {
  findById(id: string): Promise<User | null> {
    return repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return repository.findOne({ where: { email } });
  }

  createUser(user: UserRequest): Promise<User> {
    const newUser = repository.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
    });
    return repository.save(newUser);
  }
}

export const userRepository = new UserRepository();
