import {
  Body,
  JsonController,
  NotFoundError,
  Post,
  Res,
} from "routing-controllers";
import { UserService } from "../services/UserService.js";
import type { UserRequest } from "../dto/user/UserRequest.js";
import { qdrantServices } from "../services/QdrantService.js";

@JsonController("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  async createUser(
    @Body({ validate: true }) userRequest: UserRequest,
    @Res() res: any,
  ): Promise<any> {
    if (!userRequest.name) {
      throw new NotFoundError("name is required");
    }
    if (!userRequest.email) {
      throw new NotFoundError("email is required");
    }
    if (!userRequest.password) {
      throw new NotFoundError("password is required");
    }
    const user = await this.userService.createUser(userRequest);
    if (!user) {
      throw new NotFoundError("Failed to create user");
    }

    await qdrantServices.createQdrantCollection(user.id);

    return res.status(201).json({
      status: 1,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
}
