import { AppDataSource } from "../config/database.js";
import { ChatMessage } from "../model/chat.message.js";
export type chatMessageRequest = {
  chatId: string;
  role: string;
  content: string;
};
export class ChatMessageRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(ChatMessage);
  }

  async findOne(chatId: string): Promise<ChatMessage | null> {
    return this.repository.findOne({ where: { chatId } });
  }
  async find(chatId: string): Promise<ChatMessage[]> {
    return this.repository.find({ where: { chatId } });
  }

  async create(data: chatMessageRequest): Promise<ChatMessage> {
    return this.repository.save(data);
  }

  async update(data: any): Promise<ChatMessage | null> {
    const chat = await this.findOne(data.chatId);
    if (!chat) {
      return null;
    }
    Object.assign(chat, data);
    return this.repository.save(chat);
  }
}
export const chatMessageRepository = new ChatMessageRepository();
