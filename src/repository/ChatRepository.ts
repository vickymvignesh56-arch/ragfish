import { AppDataSource } from "../config/database.js";
import { Chat } from "../model/chat.js";

export type messageRequest = {
  message: string;
  chatId?: string;
};

export type chatRequest = {
  userId: string;
  appId: string;
  title: string;
};

export class ChatRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(Chat);
  }
  async findByIdAndUserId(id: string, userId: string): Promise<Chat | null> {
    return await this.repository.findOne({
      where: {
        id,
        userId,
      },
    });
  }
  async findById(id: string): Promise<Chat | null> {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async findByIdWithMessages(id: string, userId: string): Promise<Chat | null> {
    return await this.repository.findOne({
      where: {
        id,
        userId,
      },
      relations: {
        messages: true,
      },
      order: {
        messages: {
          createdAt: "ASC",
        },
      },
    });
  }

  async findByIdForContext(
    id: string,
    userId: string,
    appId: string,
  ): Promise<Chat | null> {
    return await this.repository.findOne({
      where: {
        id,
        userId,
        appId,
      },
    });
  }
  async findOne(
    userId: string,
    appId: string,
    chatId: string,
  ): Promise<Chat | null> {
    return this.repository.findOne({ where: { userId, appId, id: chatId } });
  }
  async find(userId: string, appId: string, chatId: string): Promise<Chat[]> {
    return this.repository.find({ where: { userId, appId, id: chatId } });
  }

  async create(data: chatRequest): Promise<Chat> {
    return this.repository.save(data);
  }
  async update(data: any): Promise<Chat | null> {
    const chat = await this.findOne(data.userId, data.appId, data.chatId);
    if (!chat) {
      return null;
    }
    Object.assign(chat, data);
    return this.repository.save(chat);
  }
}
export const chatRepository = new ChatRepository();
