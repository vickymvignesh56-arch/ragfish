import {
  BadRequestError,
  Body,
  JsonController,
  Post,
  Res,
  UnauthorizedError,
} from "routing-controllers";
import { userService, type LoginRequest } from "../services/UserService.js";
import type { UserRequest } from "../dto/user/UserRequest.js";
import Jwt from "jsonwebtoken";
import { authConfig } from "../env.js";

@JsonController("/auth")
export class AuthController {
  /**
   * @openapi
   * /api/auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/registerUserRequest"
   *
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/registerUserResponse"
   *
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post("/register")
  async registerUser(
    @Body({ validate: true }) userRequest: UserRequest,
    @Res() res: any,
  ): Promise<any> {
    const user = await userService.registerUser(userRequest);
    return res.status(201).json({
      status: 1,
      message: "User registered successfully",
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

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: login user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/LoginRequest"
   *
   *     responses:
   *       201:
   *         description: login successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LoginResponse"
   *
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post("/login")
  async login(@Body() loginRequest: LoginRequest, @Res() res: any) {
    if (!loginRequest.email) {
      throw new BadRequestError("Email is required");
    }

    if (!loginRequest.password) {
      throw new BadRequestError("Password is required");
    }
    const user = await userService.login(
      loginRequest.email,
      loginRequest.password,
    );
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const payload = {
      userId: user.id,
    };
    const token = await Jwt.sign(payload, authConfig.jwtSecretKey);
    return res.status(200).send({
      status: 1,
      message: "Login successfully",
      token: token,
      data: user,
    });
  }
}
