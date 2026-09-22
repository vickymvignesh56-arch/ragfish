import {
  Authorized,
  Body,
  JsonController,
  Param,
  Post,
  Req,
  Res,
} from "routing-controllers";
import { chatService } from "../services/ChatService.js";
import type { messageRequest } from "../repository/ChatRepository.js";
import { send } from "process";

@Authorized()
@JsonController("/user/app/:appId/chat")
export class ChatController {
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
      message: "User profile updated successfully",
      data: chat,
    });
  }
}
