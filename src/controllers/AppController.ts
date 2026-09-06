import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "routing-controllers";
import { CreateAppRequest } from "../dto/apps/CreateAppRequest.js";
import { appService } from "../services/AppService.js";
import type { UpdateApp } from "../repository/AppRepository.js";

@Authorized()
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
  async createApp(
    @Body({ validate: true }) appParam: CreateAppRequest,
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

  /**
   * @openapi
   * /api/apps:
   *   get:
   *     tags:
   *       - Apps
   *     summary: List all apps for current user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Apps retrieved successfully
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get()
  async getApps(@Req() req: any, @Res() res: any) {
    const userId = req.userId;
    const apps = await appService.getApps(userId);
    return res.status(200).send({
      status: 1,
      message: "successfully get apps",
      data: apps,
    });
  }

  /**
   * @openapi
   * /api/apps/{id}:
   *   get:
   *     tags:
   *       - Apps
   *     summary: Get app details by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: App details retrieved successfully
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get("/:id")
  async getAppDetails(
    @Param("id") id: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userId = req.userId;
    const app = await appService.getAppDetails(userId, id);
    if (!app) {
      throw new NotFoundError("App not found");
    }
    return res.status(200).send({
      status: 1,
      message: "successfully get app details",
      data: app,
    });
  }

  /**
   * @openapi
   * /api/apps/{id}:
   *   delete:
   *     tags:
   *       - Apps
   *     summary: Delete an app by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: App deleted successfully
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Delete("/:id")
  async deleteApp(@Param("id") id: string, @Req() req: any, @Res() res: any) {
    const userId = req.userId;
    const deleted = await appService.deleteApp(userId, id);
    if (!deleted) {
      throw new NotFoundError("App not found");
    }
    return res.status(200).send({
      status: 1,
      message: "successfully deleted app",
    });
  }
  /**
   * @openapi
   * /api/apps/{id}:
   *   put:
   *     tags:
   *       - Apps
   *     summary: update a app
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
  @Put("/:id")
  async updateApp(
    @Param("id") id: string,
    @Body({ validate: true }) appParam: UpdateApp,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userId = req.userId;
    const updatedApp = await appService.updateApp(userId, id, appParam);
    if (!updatedApp) {
      throw new NotFoundError("App not found");
    }
    return res.status(200).send({
      status: 1,
      message: "successfully updated app",
      data: updatedApp,
    });
  }
}
