import multer from "multer";
import { fileService } from "../services/FileService.js";
import { storage } from "../env.js";
import {
  Authorized,
  BadRequestError,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
} from "routing-controllers";
import { channelService } from "../services/ChannelService.js";
import { resouresProcessingQueue } from "../queue/resources-process.queue.js";
import { channelResourceService } from "../services/ChannelResourceService.js";
import fs from "fs/promises";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: storage.fileSize * 1024 * 1024,
  },
});
@JsonController("/channels/:channelId/resources")
@Authorized()
export class ChannelResourceController {
  /**
   * @openapi
   * /api/channels/{channelId}/resources/upload:
   *   post:
   *     tags:
   *       - Channel Resources
   *     summary: Upload a file to a channel
   *     description: Upload a PDF or DOCX file to the specified channel. Maximum file size is 10 MB.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: channelId
   *         in: path
   *         required: true
   *         description: ID of the channel
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: PDF or DOCX file. Maximum file size is 10 MB.
   *     responses:
   *       201:
   *         description: File uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UploadResourceResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post("/upload")
  async uploadResource(
    @Param("channelId") channelId: string,
    @UploadedFile("file", { options: { upload } }) file: Express.Multer.File,
    @Req() req: any,
    @Res() res: any,
  ) {
    try {
      const userId = req.user.id;
      const existchannel = await channelService.findBychannelIdAndUserId(
        userId,
        channelId,
      );
      if (!existchannel) {
        return res.status(404).json({
          status: 0,
          message: "Channel not found",
        });
      }
      const resource = await fileService.fileUpload(file, channelId, userId);
      if (!resource) {
        return res.status(400).json({
          status: 0,
          message: "File upload failed",
        });
      }
      await resouresProcessingQueue.add("resources-process", {
        channelId: channelId,
        userId: userId,
        resourceId: resource.id,
      });
      return res.status(201).json({
        status: 1,
        message: "File uploaded successfully",
        data: resource,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 0,
        message: error.message,
      });
    }
  }
  /**
   * @openapi
   * /api/channels/{channelId}/resources:
   *   get:
   *     tags:
   *       - Channel Resources
   *     summary: Get all resources in a channel
   *     description: Get all uploaded resources belonging to the specified channel.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: channelId
   *         in: path
   *         required: true
   *         description: ID of the channel
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Successfully retrieved resource list
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/FindResourceResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get()
  async findResource(
    @Req() req: any,
    @Res() res: any,
    @Param("channelId") channelId: string,
  ) {
    const userId = req.userId;
    const channel = await channelService.findBychannelIdAndUserId(
      userId,
      channelId,
    );
    if (!channel) {
      throw new BadRequestError("channel not found");
    }
    const resource = await channelResourceService.findByChannelId(channelId);
    return res.status(200).json({
      status: 1,
      message: "successfully got resource file list",
      data: resource,
    });
  }

  /**
   * @openapi
   * /api/channels/{channelId}/resources/{resourceId}:
   *   delete:
   *     tags:
   *       - Channel Resources
   *     summary: Delete a channel resource
   *     description: Delete an uploaded resource from the specified channel.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: channelId
   *         in: path
   *         required: true
   *         description: ID of the channel
   *         schema:
   *           type: string
   *           format: uuid
   *       - name: resourceId
   *         in: path
   *         required: true
   *         description: ID of the resource
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Resource deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeleteResourceResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Delete("/:resourceId")
  async deleteResources(
    @Param("resourceId") resourceId: string,
    @Req() req: any,
    @Res() res: any,
    @Param("channelId") channelId: string,
  ) {
    const userId = req.userId;
    const resource = await channelResourceService.deleteResource(
      channelId,
      resourceId,
      userId,
    );
    if (!resource) {
      throw new BadRequestError("resource not found");
    }
    await fileService.deleteFile(resource.filePath);
    const deleted = await channelResourceService.delete(channelId, resourceId);
    if (!deleted) {
      throw new BadRequestError("Resource delete failed");
    }
    return res.status(200).json({
      status: 1,
      message: "successfully delete resource file list",
    });
  }
  /**
   * @openapi
   * /api/channels/{channelId}/resources/{resourceId}/download:
   *   get:
   *     tags:
   *       - Channel Resources
   *     summary: Download a channel resource
   *     description: Download the uploaded PDF or DOCX resource file.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: channelId
   *         in: path
   *         required: true
   *         description: ID of the channel
   *         schema:
   *           type: string
   *           format: uuid
   *       - name: resourceId
   *         in: path
   *         required: true
   *         description: ID of the resource
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Resource file downloaded successfully
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get("/:resourceId/download")
  async downloadResource(
    @Param("resourceId") resourceId: string,
    @Param("channelId") channelId: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userId = req.userId;
    const channel = await channelService.findBychannelIdAndUserId(
      userId,
      channelId,
    );
    if (!channel) {
      throw new BadRequestError("Channel not found");
    }
    const resource = await channelResourceService.findByIdandChannelId(
      channelId,
      resourceId,
    );
    if (!resource) {
      throw new BadRequestError("Resource not found");
    }
    try {
      await fs.access(resource.filePath);
    } catch {
      throw new BadRequestError("File not found");
    }
    return res.download(resource.filePath, resource.fileName);
  }
}
