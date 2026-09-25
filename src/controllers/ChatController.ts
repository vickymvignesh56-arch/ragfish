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
import { chatService } from "../services/ChatService.js";
import type {
  messageRequest,
  updateChatRequest,
} from "../repository/ChatRepository.js";

@Authorized()
@JsonController("/user/app/:appId/chat")
export class ChatController {
  /**
   * @openapi
   * /api/user/app/{appId}/chat:
   *   post:
   *     tags:
   *       - Chat
   *     summary: Send a message to the app chat
   *     description: Send a message to an existing chat or create a new chat when chatId is not provided. The response is generated using the resources available to the chat.
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
   *         example: "7b8e4a2c-5d6f-4a1b-9c3d-2e8f6a7b1c4d"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ChatMessageRequest"
   *     responses:
   *       200:
   *         description: Message processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ChatMessageResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Post()
  async sendMessage(
    @Body({ validate: true }) chatParam: messageRequest,
    @Param("appId") appId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const chat = await chatService.sendMessage(userId, chatParam, appId);
    if (!chat) {
      throw new Error("app not found");
    }
    return res.status(200).json({
      status: 1,
      message: "successfully responesed",
      data: chat,
    });
  }

  /**
   * @openapi
   * /api/user/app/{appId}/chat:
   *   get:
   *     tags:
   *       - Chat
   *     summary: Get chat history for an app
   *     description: Retrieve all chats belonging to the authenticated user for the specified app.
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
   *         example: "7b8e4a2c-5d6f-4a1b-9c3d-2e8f6a7b1c4d"
   *     responses:
   *       200:
   *         description: Chat history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ChatHistoryResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get()
  async getMessage(
    @Param("appId") appId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const chat = await chatService.getMessage(userId, appId);
    if (chat.length === 0) {
      throw new Error("chat not found");
    }
    return res.status(200).json({
      status: 1,
      message: "successfully get chat history",
      data: chat,
    });
  }

  /**
   * @openapi
   * /api/user/app/{appId}/chat/{chatId}/message:
   *   get:
   *     tags:
   *       - Chat
   *     summary: Get messages from a chat
   *     description: Retrieve all messages belonging to the specified chat.
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
   *         example: "7b8e4a2c-5d6f-4a1b-9c3d-2e8f6a7b1c4d"
   *       - in: path
   *         name: chatId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Chat ID
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Chat messages retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ChatMessagesResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Get("/:chatId/message")
  async getChatMessage(
    @Param("appId") appId: string,
    @Param("chatId") chatId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const messages = await chatService.getChatMessage(userId, appId, chatId);
    if (messages.length === 0) {
      throw new Error("chat not found");
    }
    return res.status(200).json({
      status: 1,
      message: "successfully get chat messages",
      data: messages,
    });
  }
  /**
   * @openapi
   * /api/user/app/{appId}/chat/{chatId}:
   *   delete:
   *     tags:
   *       - Chat
   *     summary: Delete a chat
   *     description: Delete a chat and all messages associated with the chat.
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
   *         example: "7b8e4a2c-5d6f-4a1b-9c3d-2e8f6a7b1c4d"
   *       - in: path
   *         name: chatId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Chat ID
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Chat deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeleteChatResponse"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Delete("/:chatId")
  async deleteMessage(
    @Param("appId") appId: string,
    @Param("chatId") chatId: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const deleteChat = await chatService.deleteMessage(userId, appId, chatId);
    if (!deleteChat) {
      throw new Error("chat not found");
    }
    return res.status(200).json({
      status: 1,
      message: "successfully delete chat messages",
    });
  }
  /**
   * @openapi
   * /api/user/app/{appId}/chat/{chatId}:
   *   put:
   *     tags:
   *       - Chat
   *     summary: Update chat
   *     description: Update the title or pinned status of an existing chat.
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
   *         example: "7b8e4a2c-5d6f-4a1b-9c3d-2e8f6a7b1c4d"
   *       - in: path
   *         name: chatId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Chat ID
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdateChatRequest"
   *     responses:
   *       200:
   *         description: Chat updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UpdateChatResponse"
   *       400:
   *         $ref: "#/components/responses/BadRequest"
   *       401:
   *         $ref: "#/components/responses/Unauthorized"
   *       404:
   *         $ref: "#/components/responses/NotFound"
   *       500:
   *         $ref: "#/components/responses/InternalServerError"
   */
  @Put("/:chatId")
  async updateChat(
    @Param("appId") appId: string,
    @Param("chatId") chatId: string,
    @Body() body: updateChatRequest,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    const userId = req.userId;
    const updatedChat = await chatService.updateChat(
      userId,
      appId,
      chatId,
      body,
    );
    if (!updatedChat) {
      throw new Error("chat not found");
    }
    return res.status(200).json({
      status: 1,
      message: body.isPinned
        ? "successfully pinned chat "
        : "successfully update chat title",
      data: updatedChat,
    });
  }
}
