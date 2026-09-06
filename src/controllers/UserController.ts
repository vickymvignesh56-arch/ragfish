import {
  Authorized,
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Put,
  Req,
  Res,
} from "routing-controllers";
import { userService } from "../services/UserService.js";
import type { UpdateUserRequest } from "../dto/user/UpdateUserRequest.js";
@Authorized()
@JsonController("/user-profile")
export class UserController {
  /**
   * @openapi
   * /api/user-profile:
   *   get:
   *     tags:
   *       - User Profile
   *     summary: Get user profile
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserProfileResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get()
  async profileDetails(@Res() res: any, @Req() req: any) {
    const userId = req.userId;
    const user = await userService.userDetails(userId);
    if (!user) {
      throw new NotFoundError("user not found: " + userId);
    }
    return res.status(200).send({
      status: 1,
      message: "successfully get user details",
      data: user,
    });
  }

  /**
   * @openapi
   * /api/user-profile:
   *   put:
   *     tags:
   *       - User Profile
   *     summary: Update user profile
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdateUserRequest"
   *     responses:
   *       200:
   *         description: User profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserProfileResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Put()
  async updateProfile(
    @Body({ validate: true }) updateUserParam: UpdateUserRequest,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userId = req.userId;
    const user = await userService.findByUserId(userId);
    if (!user) {
      throw new BadRequestError("User not found: " + userId);
    }
    const updatedUser = await userService.updateProfile(
      userId,
      updateUserParam,
    );
    if (!updatedUser) {
      throw new BadRequestError("Unable to update user profile");
    }
    return res.status(200).json({
      status: 1,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  }
}
