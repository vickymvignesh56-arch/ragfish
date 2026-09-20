import {
  Authorized,
  Body,
  JsonController,
  Post,
  Req,
  Res,
} from "routing-controllers";
import { chatService } from "../services/ChatService.js";
import type { messageRequest } from "../repository/ChatRepository.js";

@Authorized()
@JsonController("/user/app/:appId/chat")
export class ChatController {
  @Post()
  async sendMessage(
    @Body({ validate: true }) chatParam: messageRequest,
    @Req() req: any,
    @Res() res: any,
  ) {}
}
