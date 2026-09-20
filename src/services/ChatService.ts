import {
  chatMessageRepository,
  ChatMessageRepository,
} from "../repository/ChatMessageRepository.js";
import {
  chatRepository,
  ChatRepository,
} from "../repository/ChatRepository.js";

export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
  ) {}
}

export const chatService = new ChatService(
  chatRepository,
  chatMessageRepository,
);
