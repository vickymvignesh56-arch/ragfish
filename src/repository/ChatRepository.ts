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
  resourceId: string[];
};

export type updateChatRequest = {
  title?: string;
  isPinned?: boolean;
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
      order: {
        createdAt: "DESC",
      },
    });
  }
  async findById(id: string): Promise<Chat | null> {
    return await this.repository.findOne({
      where: {
        id,
      },
      order: {
        createdAt: "DESC",
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
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findOne(
    userId: string,
    appId: string,
    chatId: string,
  ): Promise<Chat | null> {
    return this.repository.findOne({
      where: { userId, appId, id: chatId },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async find(userId: string, appId: string, chatId: string): Promise<Chat[]> {
    return this.repository.find({
      where: { userId, appId, id: chatId },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findByUserIdAndAppId(userId: string, appId: string): Promise<Chat[]> {
    return this.repository.find({
      where: { userId, appId },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async create(data: chatRequest): Promise<Chat> {
    return this.repository.save(data);
  }
  async update(data: updateChatRequest, chatId: string): Promise<Chat | null> {
    const chat = await this.repository.findOne({ where: { id: chatId } });
    if (!chat) {
      return null;
    }
    if (data.title !== undefined) {
      chat.title = data.title;
    }
    if (data.isPinned !== undefined) {
      chat.isPinned = data.isPinned;
      chat.pinnedAt = data.isPinned ? new Date() : null;
    }
    return this.repository.save(chat);
  }

  async delete(chatId: string): Promise<boolean> {
    const result = await this.repository.delete({ id: chatId });
    return (result.affected ?? 0) > 0;
  }
}
export const chatRepository = new ChatRepository();
