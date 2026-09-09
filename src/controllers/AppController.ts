import {
  Authorized,
  BadRequestError,
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
import type {
  CreateAppChannel,
  CreateAppChannelResource,
  UpdateApp,
} from "../repository/AppRepository.js";
import { appChannelService } from "../services/AppChannelService.js";
import { appChannelResourceService } from "../services/AppChannelResourceService.js";

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
  /**
   * @openapi
   * /api/apps/{appId}/channel:
   *   post:
   *     tags:
   *       - Apps
   *     summary: Add a channel to an app
   *     description: Adds an existing channel to an app after validating the channel ownership.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: appId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateAppChannelRequest"
   *     responses:
   *       201:
   *         description: Channel successfully added to app
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/CreateAppChannelResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post("/:appId/channel")
  async addAppChannel(
    @Req() req: any,
    @Res() res: any,
    @Body() data: CreateAppChannel,
    @Param("appId") appId: string,
  ) {
    const userId = req.userId;
    const appChannel = await appChannelService.createAppChannel(
      data.channelId,
      appId,
      userId,
    );
    if (!appChannel) {
      throw new BadRequestError("channel not found: " + data.channelId);
    }
    return res.status(201).send({
      status: 1,
      message: "Channel successfully added to app",
      data: appChannel,
    });
  }
  /**
   * @openapi
   * /api/apps/{appId}/channel/{appChannelId}:
   *   get:
   *     tags:
   *       - Apps
   *     summary: Get an app channel
   *     description: Retrieves an app channel along with its channel details and associated resources.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: appId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App ID
   *       - in: path
   *         name: appChannelId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App channel ID
   *     responses:
   *       200:
   *         description: App channel fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAppChannelResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get("/:appId/channel/:appChannelId")
  async getAppChannel(
    @Req() req: any,
    @Res() res: any,
    @Param("appChannelId") appChannelId: string,
    @Param("appId") appId: string,
  ) {
    const userId = req.userId;
    const appChannel = await appChannelService.getAppChannel(
      appChannelId,
      appId,
      userId,
    );
    if (!appChannel) {
      throw new BadRequestError("channel not found: " + appChannelId);
    }
    return res.status(200).send({
      status: 1,
      message: "App channel fetched successfully",
      data: appChannel,
    });
  }

  /**
   * @openapi
   * /api/apps/{appId}/channel/{appChannelId}/resource:
   *   post:
   *     tags:
   *       - Apps
   *     summary: Add a resource to an app channel
   *     description: Adds an existing channel resource to an app channel after validating the app, app channel, and resource ownership.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: appId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App ID
   *       - in: path
   *         name: appChannelId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App channel ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateAppChannelResourceRequest"
   *     responses:
   *       201:
   *         description: Resource successfully added to app channel
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAppChannelResourceResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post("/:appId/channel/:appChannelId/resource")
  async createAppChannelResources(
    @Req() req: any,
    @Res() res: any,
    @Body() data: CreateAppChannelResource,
    @Param("appChannelId") appChannelId: string,
    @Param("appId") appId: string,
  ) {
    const userId = req.userId;
    const appChannel = await appChannelResourceService.createAppChannelResource(
      data.channelResourceId,
      appId,
      userId,
      appChannelId,
    );
    if (!appChannel) {
      throw new BadRequestError(
        "Resource not found: " + data.channelResourceId,
      );
    }
    return res.status(201).send({
      status: 1,
      message: "Resource successfully added to app channel",
      data: appChannel,
    });
  }
  /**
   * @openapi
   * /api/apps/{appId}/channel/{appChannelId}/resource/{channelResourceId}:
   *   get:
   *     tags:
   *       - Apps
   *     summary: Get a resource from an app channel
   *     description: Retrieves a resource mapping from an app channel after validating the app, app channel, and channel resource.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: appId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App ID
   *       - in: path
   *         name: appChannelId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: App channel ID
   *       - in: path
   *         name: channelResourceId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Channel resource ID
   *     responses:
   *       200:
   *         description: Resource successfully retrieved
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAppChannelResourceResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post("/:appId/channel/:appChannelId/resource/:channelResourceId")
  async getAppChannelResources(
    @Req() req: any,
    @Res() res: any,
    @Param("appChannelId") appChannelId: string,
    @Param("appId") appId: string,
    @Param("channelResourceId") channelResourceId: string,
  ) {
    const userId = req.userId;
    const appChannel = await appChannelResourceService.getAppChannelResource(
      channelResourceId,
      appId,
      userId,
      appChannelId,
    );
    if (!appChannel) {
      throw new BadRequestError("Resource not found: " + channelResourceId);
    }
    return res.status(200).send({
      status: 1,
      message: "Resource retrieved successfully",
      data: appChannel,
    });
  }
}
