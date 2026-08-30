import {
  Authorized,
  Body,
  JsonController,
  Post,
  Req,
  Res,
} from "routing-controllers";
import type { CreateAppRequest } from "../dto/apps/CreateAppRequest.js";
import { appService } from "../services/AppService.js";

@JsonController("/apps")
export class AppController {
  /**
   * @openapi
   * /api/apps:
   *   post:
   *     tags:
   *       - Apps
   *     summary: Create a new app
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateAppRequest"
   *     responses:
   *       200:
   *         description: App created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/CreateAppResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post()
  @Authorized()
  async createApp(
    @Body() appParam: CreateAppRequest,
    @Res() res: any,
    @Req() req: any,
  ) {
    const userId = req.userId;
    const app = await appService.createApp(userId, appParam);
    return res.status(200).send({
      status: 1,
      message: "successfully creaet app",
      data: app,
    });
  }
}
