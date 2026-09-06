import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "routing-controllers";
import { channelService } from "../services/ChannelService.js";
import type {
  CreateChannelRequest,
  UpdateChannelRequest,
} from "../repository/ChannelRepository.js";
@Authorized()
@JsonController("/channels")
export class ChannelController {
  /**
   * @openapi
   * /api/channels:
   *   post:
   *     tags:
   *       - Channels
   *     summary: Create a new channel
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateChannelRequest"
   *     responses:
   *       201:
   *         description: Channel created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/CreateChannelResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post()
  async createChannel(
    @Body() channelData: CreateChannelRequest,
    @Res() res: any,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.userId;
    const channel = await channelService.create(userId, channelData);
    return res.status(201).send({
      status: 1,
      message: "Channel created successfully",
      data: channel,
    });
  }
  /**
   * @openapi
   * /api/channels:
   *   get:
   *     tags:
   *       - Channels
   *     summary: Get all channels
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Channels fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetChannelsResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get()
  async getChannels(@Req() req: any, @Res() res: any): Promise<any> {
    const userId = req.userId;
    const channels = await channelService.find(userId);
    if (!channels || channels.length === 0) {
      return res.status(404).send({
        status: 0,
        message: "No channels found",
      });
    }
    return res.status(200).send({
      status: 1,
      message: "Channels fetched successfully",
      data: channels,
    });
  }
  /**
   * @openapi
   * /api/channels/{id}:
   *   get:
   *     tags:
   *       - Channels
   *     summary: Get channel by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: Channel ID
   *         schema:
   *           type: string
   *           format: uuid
   *         example: "c8f7e2a1-1234-4567-8901-abcdef123456"
   *     responses:
   *       200:
   *         description: Channel fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetChannelResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get("/:id")
  async getChannelById(
    @Param("channelId") channelId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const channel = await channelService.findOne(userId, channelId);
    if (!channel) {
      return res.status(404).send({
        status: 0,
        message: "Channel not found",
      });
    }
    return res.status(200).send({
      status: 1,
      message: "Channel fetched successfully",
      data: channel,
    });
  }
  /**
   * @openapi
   * /api/channels/{channelId}:
   *   delete:
   *     tags:
   *       - Channels
   *     summary: Delete channel
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: Channel ID
   *         schema:
   *           type: string
   *           format: uuid
   *         example: "c8f7e2a1-1234-4567-8901-abcdef123456"
   *     responses:
   *       200:
   *         description: Channel deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeleteChannelResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Delete("/:channelId")
  async deleteChannel(
    @Param("channelId") channelId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const channel = await channelService.findOne(userId, channelId);
    if (!channel) {
      return res.status(404).send({
        status: 0,
        message: "Channel not found",
      });
    }
    await channelService.delete(userId, channelId);
    return res.status(200).send({
      status: 1,
      message: "Channel deleted successfully",
    });
  }
  /**
   * @openapi
   * /api/channels/{id}:
   *   put:
   *     tags:
   *       - Channels
   *     summary: Update channel
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: Channel ID
   *         schema:
   *           type: string
   *           format: uuid
   *         example: "c8f7e2a1-1234-4567-8901-abcdef123456"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdateChannelRequest"
   *     responses:
   *       200:
   *         description: Channel updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UpdateChannelResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Put("/:id")
  async updateChannel(
    @Req() req: any,
    @Res() res: any,
    @Body() updateData: UpdateChannelRequest,
  ): Promise<any> {
    const userId = req.user.id;
    const channelId = req.params.id;
    const channel = await channelService.findOne(userId, channelId);
    if (!channel) {
      return res.status(404).send({
        status: 0,
        message: "Channel not found",
      });
    }
    const updatedChannel = await channelService.update(
      userId,
      channelId,
      updateData,
    );
    return res.status(200).send({
      status: 1,
      message: "Channel updated successfully",
      data: updatedChannel,
    });
  }
}
